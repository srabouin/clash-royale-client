const ByteBuffer = require('../../../../utils/bytebuffer-sc')
const ClanChat = require('../../component/ClanChat')

module.exports.code = 23174

module.exports.handle = (session, data) => {
    ClanChat.handle(session, data)
}
