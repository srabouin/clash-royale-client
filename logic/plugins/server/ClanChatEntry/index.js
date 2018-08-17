const ByteBuffer = require('../../../../utils/bytebuffer-sc')
const ClanChat = require('../../component/ClanChat')

module.exports.code = 23174

module.exports.handle = (client, data) => {
    ClanChat.handle(client, data)
}
