const log = console.log
const chalk = require('chalk')
const spells = require('../../../../logic/spells')
const gameModes = require('../../../../utils/csv')('csv_logic/game_modes.csv')

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

const events = {
    1: "has been kicked by %2",
    2: "has been accepted by %2",
    3: "has joined the clan",
    4: "has left the clan",
    5: "has been promoted by %2",
    6: "has been demoted by %2"
}

module.exports.handle = (session, message) => {
  switch (message.type) {
    case ids.EVENT:
      log(chalk`⚠️  {bold ${message.senderNick}} ${events[message.data.id].replace('%2', message.data.initiatorNick)}`)
      break
    case ids.BATTLE:
      if(message.data.player2) {
        log(chalk`🎯  {bold ${message.senderNick}}] has partnered with {bold ${message.data.player2.name}}`)
      } else {
        log(chalk`🎯  {bold ${message.senderNick}}] is looking for a partner`)
      }
      break
    case ids.BATTLE_FINISHED:
      let battle = JSON.parse(message.data.battleJson)
      let gamemode = battle.game_config.gamemode - 72000000

      if(!battle.player0.stars) {
        battle.player0.stars = 0
      }

      if(!battle.player1.stars) {
        battle.player1.stars = 0
      }

      if(gameModes[gamemode].Players == 'TvT') {
        log(chalk`🎯  {bold ${battle.player0.name}} + {bold ${battle.player2.name}} vs {bold ${battle.player1.name}} + {bold ${battle.player3.name}} - {bold ${battle.player0.stars}-${battle.player1.stars}}`)
      } else {
        log(chalk`🎯  {bold ${battle.player0.name}} vs {bold ${battle.player1.name}} - {bold ${battle.player0.stars}-${battle.player1.stars}}`)
      }


      break
    case ids.CHAT:
      log(chalk`✉️  {bold ${message.senderNick}}: ${message.data.message}`)
      break
    case ids.DONATION:
      let count = 0

      message.data.donations.forEach(function(donation) {
        count+= donation.count
      })

      if(count > 0) {
        log(chalk`🎁  {bold ${message.senderNick}} received donations for {bold ${spells.find(message.data.spells[0].scid).Name}} ${count}/${message.data.maximum}`)
      } else {
        log(chalk`🎁  {bold ${message.senderNick}} requested donations for {bold ${spells.find(message.data.spells[0].scid).Name}} ${count}/${message.data.maximum}`)
      }
      break
  }
}
