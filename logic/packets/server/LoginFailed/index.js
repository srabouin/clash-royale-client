const ByteBuffer = require('../../../../utils/bytebuffer-sc')
const fs = require('fs')
const async = require('async')
const ProgressBar = require('progress')
const axios = require('axios')
const my_lzma = require("lzma")

module.exports.code = 20103

module.exports.decode = (payload) => {
  buffer = ByteBuffer.fromBinary(payload)

  let json = {
      code: buffer.readRrsInt32(),
      resourceFingerprintData: buffer.readIString(),
      redirectDomain: buffer.readIString(),
      unk2: buffer.readIString(),
      unk3: buffer.readIString(),
      unk4: buffer.readRrsInt32(),
      unk5: buffer.readRrsInt32(),
      unk6: buffer.readRrsInt32(),
      contentURL: buffer.readIString(),
      updateURL: buffer.readIString()
  }

  if(json.resourceFingerprintData) {
      json.parsed = JSON.parse(json.resourceFingerprintData)
      delete json.resourceFingerprintData
  }

  return json
}

module.exports.callback = (session, data) => {
  if (data.code === 7) {
    let config = require('../../../../config.js')
    console.log(`Resource SHA updated after maintenance. Downloading updated assets...`)

    let filesToDownload = {}
    data.parsed.files.forEach((file) => {
        if(file.file.indexOf('csv') !== -1) {
            filesToDownload[file.file] = file.sha
        }
    })

    let bar = new ProgressBar(':current/:total: :file', { total: Object.keys(filesToDownload).length })

    async.eachOfSeries(filesToDownload, (sha, file, done) => {
        bar.tick(1, { file: file })
        let filename = data.updateURL + "/" + data.parsed.sha + "/" + file
        if(config.filesToDownload && config.filesToDownload[file] && sha == config.filesToDownload[file]) {
            done()
        } else {
            axios.get(filename, { responseType: 'arraybuffer' })
              .then(function (response) {
                  let buffer = ByteBuffer.fromBinary(response.data)
                  let newBuffer = ByteBuffer.allocate(buffer.limit + 4)

                  buffer.copyTo(newBuffer, 0, 0, 9)
                  newBuffer.append("00000000", "hex", 9)
                  buffer.copyTo(newBuffer, 13, 9, buffer.limit)

                  newBuffer.compact()

                  fs.writeFileSync('./resources/' + file, my_lzma.decompress(newBuffer.toBuffer()))
                  done()
              })
              .catch(function (error) {
                  done(error)
              })
        }

    }, (err, results) => {
        if(err) {
            console.log(`\nThere was an issue downloading one file: ${err}, please try again later.`)
        } else {
            console.log(`\nDownload complete`)
            config.resourceSha = data.parsed.sha
            config.filesToDownload = filesToDownload
            fs.writeFileSync('./config.js', 'module.exports = ' + JSON.stringify(config, null, 3))
        }
        process.exit()
    })

  } else if(data.code === 10) {
    console.log('Servers are in maintenance. ETA: ', data.seconds)
    process.exit()
  } else {
    console.log(`Couldn't log in. Check your credentials.`)
    process.exit()
  }
}
