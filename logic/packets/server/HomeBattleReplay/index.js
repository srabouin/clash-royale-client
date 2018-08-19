const ByteBuffer = require('../../../../utils/bytebuffer-sc')
const zlib = require('zlib')

module.exports.code = 21021
module.exports.decode = payload => {
    buffer = ByteBuffer.fromBinary(payload)

    let json = {
      type: buffer.readRrsInt32()
    }
    let len = buffer.readInt32() - 4
    buffer.readInt32() // should be LE but we don't care about this length
    json.replay = zlib.unzipSync(buffer.slice(buffer.offset, buffer.offset + len).toBuffer()).toString()

    return json
}

module.exports.hidden = true
