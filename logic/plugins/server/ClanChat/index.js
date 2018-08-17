const ClanChat = require('../../component/ClanChat')

module.exports.code = 24435

module.exports.handle = (session, data) => {
  data.forEach((message) => {
    ClanChat.handle(session, message)
  })
}
