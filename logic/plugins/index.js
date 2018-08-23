const fs = require('fs')

let plugins = {}

const load = dir => fs.readdir('./logic/plugins/' + dir, (err, files) => {
  if(!err) {
    for (let file of files) {
      let plugin = require(`./${dir}/${file}`)
      plugins[file] = plugins[plugin.code] = Object.assign({
        name: file
      }, plugin)
    }
  }
})

load('server')
load('client')

module.exports = plugins
