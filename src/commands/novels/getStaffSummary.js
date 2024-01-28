const { Novel, User, Chapter, Coin, View } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')

module.exports = {
  name: 'staff-summary',
  description: `Gets an overview of how a certain staff member is doing.`,
  devOnly: true,
  options: [
    {
      name: 'user',
      description: 'The staff member.',
      type: ApplicationCommandOptionType.User,

    },
    {
      name: 'user-name',
      description: 'The Discord name of the staff member.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  // testOnly: Boolean,
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const channel = interaction.channel
    await interaction.deferReply();

    const user = interaction.options.get('user')?.value || null
    const name = interaction.options.get('user-name')?.value || null

    // Checks if there already is a novel in the db with the same name
    let staff;
    if (user) {
      staff = await User.findOne({ where: { discordSnowflake: user } })
    }
    else if (name) {
      staff = await User.findOne({
        where: { discordUsername: name },
      })
    }
    else {
      interaction.editReply('You must ping a user or supply their name.')
      return
    }

    if (!staff) {
      interaction.editReply('I could not find that staff member in the database.')
      return
    }

    // TODO: This
  },
}
