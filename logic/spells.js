const characters = require('../utils/csv')('csv_logic/spells_characters.csv')
const buildings = require('../utils/csv')('csv_logic/spells_buildings.csv')
const others = require('../utils/csv')('csv_logic/spells_other.csv')
const texts = require('../utils/csv')('csv_client/texts.csv')

let shortIds = []
let shortId = 0

characters.forEach(function(character, k) {
  texts.forEach(function(text) {
    if(text.v == character.TID) {
      characters[k].Name = text.EN
    }
  })
  shortIds.push(character)
})

buildings.forEach(function(building, k) {
  texts.forEach(function(text) {
    if(text.v == building.TID) {
      buildings[k].Name = text.EN
    }
  })
  shortIds.push(building)
})

others.forEach(function(other, k) {
  texts.forEach(function(text) {
    if(text.v == other.TID) {
      others[k].Name = text.EN
    }
  })
  shortIds.push(other)
})

module.exports.find = (scid) => {
  switch(scid.high) {
    case 26: return characters[scid.low]
    case 27: return buildings[scid.low]
    case 28: return others[scid.low]
  }
}

module.exports.findByShortId = (id) => {
  return shortIds[id]
}
