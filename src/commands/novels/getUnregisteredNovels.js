const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')
const { table } = require('table')
const sendTableMessage = require('../../utils/sendTableMessage')

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

    reply.push(['ID', 'Title', 'Translator', 'Original'])
    for (const n of allNovels) {
      if (!n.translatorId) {
        const row = [n.novelId, n.novelTitle.length > 30 ? n.novelTitle.substring(0, 27) + "..." : n.novelTitle, n.translatorUsername, n.original]
        reply.push(row)
      }
    }

    let dataTable = table(reply) + ""
    sendTableMessage(dataTable, channel, interaction)
  },
}
