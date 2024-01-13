const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')
const { table } = require('table')

module.exports = {
  name: 'unregistered-novels',
  description: `Gets a list of all novels with unregistered translators.`,
  devOnly: true,
  // testOnly: Boolean,
  deleted: false,
  //   permissionsRequired: [PermissionFlagsBits.Administrator],
  //botPermissions: [PermissionFlagsBits.Administrator],

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const channel = interaction.channel
    await interaction.deferReply();

    const allNovels = await Novel.findAll()

    let reply = []
    let message = ''
    let i = 0

    reply.push(['ID', 'Title', 'Translator', 'Original'])
    for (const n of allNovels) {
      if (!n.translatorId) {
        const row = [n.novelId, n.novelTitle.length > 30 ? n.novelTitle.substring(0, 27) + "..." : n.novelTitle, n.translatorUsername, n.original]
        reply.push(row)
      }
    }

    let dataTable = table(reply) + ""

    if (dataTable.length > 1994) {
      // scuffed lol
      const endRowIndex = dataTable.substring(1600).indexOf('║') + 1600
      interaction.editReply("```" + dataTable.substring(0, endRowIndex) + "```")
      for (let i = 1; i < dataTable.length / endRowIndex; i++) {
        channel.send("```" + dataTable.substring(i * endRowIndex, (i + 1) * endRowIndex) + "```")
      }
    } else {
      interaction.editReply("```" + dataTable + "```")
    }
  },
}
