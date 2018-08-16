const fs = require('fs')
const parse = require('csv-parse/lib/sync');

module.exports = file => {
    let csv = parse(fs.readFileSync('./resources/' +file), {columns: true}).slice(1)

    return csv.filter(function(element) {
      return (element.Name !== "")
    });
}
