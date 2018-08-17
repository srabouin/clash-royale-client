const ClanChat = require('../../component/ClanChat')

module.exports.code = 24435

module.exports.handle = (client, data) => {
  data.forEach((message) => {
    ClanChat.handle(client, message)
  })
}
