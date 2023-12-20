const getWebScrapers = require('../utils/getWebScrapers')
const updateNovelDatabase = require('../libs/database/updateNovelDatabase')

module.exports = async (client) => {
  const scrapers = getWebScrapers()

  for (const s of scrapers) {
    await s.run(client)
  }
}
