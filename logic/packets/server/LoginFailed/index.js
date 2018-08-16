const ByteBuffer = require('../../../../utils/bytebuffer-sc')
const fs = require('fs')
const fingerprint = require('../../../../resources/fingerprint.json')

module.exports.code = 20103

module.exports.decode = (payload) => {
  buffer = ByteBuffer.fromBinary(payload)

  let code = buffer.readRrsInt32()

  if (code === 7) {
    let json = {
      resourceFingerprintData: buffer.readIString(),
      redirectDomain: buffer.readIString(),
      unk2: buffer.readIString(),
      unk3: buffer.readIString(),
      unk4: buffer.readRrsInt32(),
      unk5: buffer.readRrsInt32(),
      unk6: buffer.readIString(),
      unk7: buffer.readRrsInt32(), // array count for next fields?
      contentURL: buffer.readIString(),
      updateURL: buffer.readIString()
    }

    if(json.resourceFingerprintData) {
      json.parsed = JSON.parse(json.resourceFingerprintData)
    }

    console.log(`Your fingerprint.json is outdated and has been updated. old: ${fingerprint.sha} new: ${json.parsed.sha}`)

    fs.writeFileSync('./resources/fingerprint.json', json.resourceFingerprintData)

    let config = require('../../../../config.js')
    config.updateURL = json.updateURL
    config.contentURL = json.contentURL
    fs.writeFileSync('./config.js', 'module.exports = ' + JSON.stringify(config, null, 3))

  } else if(code === 10) {
    buffer.readIString()
    buffer.readIString()
    buffer.readIString()
    buffer.readIString()
    buffer.readIString()
    console.log('Servers are in maintenance. ETA: ', payload.readRrsInt32())
  } else {
    console.log(`Couldn't log in. Check your credentials.`)
  }

  process.exit()
}
