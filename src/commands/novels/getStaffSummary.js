const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')

module.exports = {
  name: 'staff-summary',
  description: `Gets an overview of all registered staff members. Actually does nothing lol`,
  // devOnly: Boolean,
  // testOnly: Boolean,
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    interaction.reply('hi :)')
  },
}
