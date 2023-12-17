const { User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')
const updateNovelDatabase = require('../../libs/database/updateNovelDatabase')
const webScraperHandler = require('../../handlers/webScraperHandler')

module.exports = {
  name: 'scan',
  description: 'Scans the Luminary Novels website and gets data on all novels.',
  devOnly: true,
  testOnly: true,
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply()
    let data = 'hi'

    // const testUrl = 'https://luminarynovels.com/manga-2/'
    // try {
    //   data = await scrapeTotalNovelInformation(testUrl)
    //   // console.log(data)
    // } catch (error) {
    //   interaction.editReply('Something went wrong...')
    // }

    // const firstNovel = data[0]
    // scrapeSpecificNovelInformation(firstNovel.url)

    // const allNovelInfo = await loginLuminarySite()
    // await updateNovelDatabase(allNovelInfo, client)
    await webScraperHandler(client)

    interaction.editReply('hi')
  },
}
