const ByteBuffer = require('../../../../utils/bytebuffer-sc')
const config = require('../../../../config')
const fingerprint = require('../../../../resources/fingerprint.json')

module.exports.code = 10100
module.exports.payload = () => {
    let buf = ByteBuffer.allocate(72)

    buf.writeInt32(2)
    buf.writeInt32(19)
    buf.writeInt32(3)
    buf.writeInt32(0)
    buf.writeInt32(1186)
    buf.writeIString(fingerprint.sha)
    buf.writeInt32(2)
    buf.writeInt32(2)
    return buf.buffer
}
