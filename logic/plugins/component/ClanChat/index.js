const log = console.log
const chalk = require('chalk')
const spells = require('../../../../logic/spells')

const ids = {
  DONATION: 1,
  CHAT: 2,
  JOIN_REQUEST: 3,
  EVENT: 4,
  REPLAY: 5,
  BATTLE: 10,
  BATTLE_FINISHED: 11,
  DECK_SHARE: 15,
  WAR_EVENT: 17,
}

module.exports.handle = (client, message) => {
  switch (message.id) {
    case ids.BATTLE:
      if(message.data.player2) {
        log(chalk`[{bold ${message.senderNick}}] has partnered with {bold ${message.data.player2.name}}`)
      } else {
        log(chalk`[{bold ${message.senderNick}}] is looking for a partner`)
      }
      break
    case ids.BATTLE_FINISHED:
      console.log(message)
      break
    case ids.CHAT:
      log(chalk`[{bold ${message.senderNick}}] ${message.data.message}`)
      break
    case ids.DONATION:
      let count = 0

      message.data.donations.forEach(function(donation) {
        count+= donation.count
      })

      if(count > 0) {
        log(chalk`[{bold ${message.senderNick}}] received donations for {bold ${spells.find(message.data.spells[0].scid).Name}} ${count}/${message.data.maximum}`)
      } else {
        log(chalk`[{bold ${message.senderNick}}] requested donations for {bold ${spells.find(message.data.spells[0].scid).Name}} ${count}/${message.data.maximum}`)
      }
      break
    default:
      console.log('unknown id: ' + message.id)
  }
}
