const { User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const notifyNewChapters = require('../../libs/database/notifyNewChapters')

module.exports = {
  name: 'ping',
  description: `Replies with the bot's ping. Also tests notifyNewChapters`,
  devOnly: true,
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply()

    const reply = await interaction.fetchReply()

    const ping = reply.createdTimestamp - interaction.createdTimestamp

    notifyNewChapters(
      2,
      `A Villainous Aristocrat's Pursuit of Peace ~ Reincarnated as the Most Talented Mage in History, I'll Achieve Supremacy in order to live a peaceful life with My Maid~`,
      'https://luminarynovels.com/novel/a-villainous-aristocrat-of-swordsmanship-yearning-for-tranquility-reincarnated-as-the-ultimate-antagonist-character-possessing-the-greatest-magical-talent-in-history-striving-to-become-the-stronges/',
      null,
      client
    )

    interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`)
  },
}
