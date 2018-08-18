
module.exports.code = 21021
module.exports.handle = payload => {
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
