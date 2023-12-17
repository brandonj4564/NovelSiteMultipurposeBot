const { User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const notifyNewChapters = require('../../libs/database/notifyNewChapters')

module.exports = {
  name: 'leave',
  description: `Leaves the server.`,
  devOnly: true,
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.guild.leave()
  },
}
