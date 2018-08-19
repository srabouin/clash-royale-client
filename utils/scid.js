
module.exports = {
  toHiLo: (scid) => {
    let high = Math.floor(scid / 1000000)
    let low = scid % 1000000
    return {
      high: high,
      low: low
    }
  },

  fromHilo: (id) => {
      return (id.high * 1000000 + id.low)
  }
}
