const path = require('path')
const getAllFiles = require('./getAllFiles')

module.exports = (exceptions = []) => {
  let webScrapers = []

  const scrapers = getAllFiles(path.join(__dirname, '..', 'webscrapers'))

  for (const scraper of scrapers) {
    const scraperObject = require(scraper)

    if (exceptions.includes(scraperObject.name)) {
      continue // skip this iteration of the loop if the command is an exception
    }
    webScrapers.push(scraperObject)
  }

  return webScrapers
}
