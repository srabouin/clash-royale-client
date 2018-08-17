const ByteBuffer = require('../../../../utils/bytebuffer-sc')

module.exports.code = 14114

module.exports.payload = (session, params) => {
    let buf = ByteBuffer.allocate(34)

    buf.writeInt32(params.id.high)
    buf.writeInt32(params.id.low)
    buf.writeByte(0)
    buf.writeByte(params.server)
    buf.writeByte(127)
    buf.writeByte(127)
    buf.writeByte(3)
    buf.writeByte(2)
    buf.writeByte(0)
    return buf.buffer
}

// module.exports.disabled = true
