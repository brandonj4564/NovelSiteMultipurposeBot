const getWebScrapers = require('../utils/getWebScrapers')
const updateNovelDatabase = require('../libs/database/updateNovelDatabase')

module.exports = async (client) => {
  const scrapers = getWebScrapers()

  for (const s of scrapers) {
    const allNovelInfo = await s.run()
    await updateNovelDatabase(allNovelInfo, client)
  }
  // that's it lol
}
