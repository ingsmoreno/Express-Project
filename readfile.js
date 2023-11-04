const fs = require('fs');

const readFile = (file) => {
   return fs.readFileSync(`${__dirname}/dev-data/${file}`, 'utf-8')
}

module.exports = readFile;
