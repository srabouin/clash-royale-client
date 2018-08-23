const net = require('net')
const Packetizer = require('./utils/packetizer')
const consoleUtil = require('./utils/console')
const SaveSession = require('./utils/save')
const config = require('./config')
const session = require('./logic/session')
const fingerprint = require('./resources/fingerprint.json')
const async = require('async')
const ProgressBar = require('progress')
const axios = require('axios')
const my_lzma = require('lzma')
const ByteBuffer = require('./utils/bytebuffer-sc')
const fs = require('fs')

function startClient(account) {
    let saveSession = null
    const packetizer = new Packetizer()
    const gameserver = new net.Socket()

    session.server = gameserver
    session.account = account

    if (process.argv.indexOf('--save') > -1 || process.argv.indexOf('-s') > -1) {
      session.saveSession = new SaveSession(config.savePath)
      console.log('[*] Saving session in', session.saveSession._folder)
    }

    let filesToDownload = {}
    fingerprint.files.forEach((file) => {
        if(file.file.indexOf('csv') !== -1) {
            if(!config.filesToDownload || !config.filesToDownload[file.file] || config.filesToDownload[file.file] != file.sha) {
                filesToDownload[file.file] = file.sha
            }
        }
    })

    if(Object.keys(filesToDownload).length) {
        console.log(`Some files require an update, downloading...`)
        let bar = new ProgressBar(':current/:total: :file', { total: Object.keys(filesToDownload).length })

        async.eachOfSeries(filesToDownload, (sha, file, done) => {
            bar.tick(1, { file: file })
            let filename = config.updateURL + "/" + fingerprint.sha + "/" + file

            axios.get(filename, { responseType: 'arraybuffer' })
              .then(function (response) {
                  let buffer = ByteBuffer.fromBinary(response.data)
                  let newBuffer = ByteBuffer.allocate(buffer.limit + 4)

                  buffer.copyTo(newBuffer, 0, 0, 9)
                  newBuffer.append("00000000", "hex", 9)
                  buffer.copyTo(newBuffer, 13, 9, buffer.limit)

                  newBuffer.compact()

                  decompressed = my_lzma.decompress(newBuffer.toBuffer())
                  fs.writeFileSync('./resources/' + file, decompressed)
                  done()
              })
              .catch(function (error) {
                  done(error)
              })
        }, (err, results) => {
            if(err) {
                console.log(`\nThere was an issue downloading one file: ${err}, please try again later.`)
            } else {
                console.log(`\nDownload complete`)
                if(!config.filesToDownload) {
                    config.filesToDownload = {}
                }

                for(var k in filesToDownload) {
                    config.filesToDownload[k] = filesToDownload[k]
                }

                fs.writeFileSync('./config.js', 'module.exports = ' + JSON.stringify(config, null, 3))

                gameserver.connect(9339, 'game.clashroyaleapp.com', () => {
                    session.start()
                })
            }
        })
    } else {
        gameserver.connect(9339, 'game.clashroyaleapp.com', () => {
            session.start()
        })
    }

    gameserver.on('data', chunk => {
        packetizer.packetize(chunk, (packet) => {
          let message = {
            code: packet.readUInt16BE(0),
            length: packet.readUIntBE(2, 3),
            payload: packet.slice(7, packet.length)
          }

          session.receive(message)
        })
    })
}

if(config.credentials.length > 1) {
    consoleUtil
      .prompt({
        type: 'list',
        name: 'account',
        message: 'Select account',
        choices: config.credentials.map(account => account.name ? account.name : account.tag),
        pageSize: 10
      })
    .then(answers => {
        startClient(config.credentials.find(account => account.name === answers.account))
    })
} else {
    startClient(config.credentials[0])
}


module.exports.account = {}
