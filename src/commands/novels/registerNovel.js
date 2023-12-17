const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')

module.exports = {
  name: 'register-novel',
  description: 'Registers a new novel.',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'novel-name',
      description: 'The name of the novel, in English.',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'editor',
      description: 'The editor of the novel, if there is one. Do not ping more than one person for this.',
      required: false,
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
  deleted: true,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply()

    // let user = await User.findOne({ where: { discordSnowflake: interaction.member.id } })
    // // Looks through the DB to try and find a discord user with the same unique ID as the one who called this command
    // if (!user) {
    //   // If no user is found, then we create a data entry for that user
    //   user = await new User({ discordSnowflake: interaction.member.id }).save()
    // }

    const editor = interaction.options.get('editor')?.value || null

    // Checks if there already is a novel in the db with the same name and translator
    let novel = await Novel.findOne({
      where: { novelTitle: interaction.options.get('novel-name').value, translator: interaction.member.id },
    })
    if (!novel) {
      novel = await new Novel({
        novelTitle: interaction.options.get('novel-name').value,
        numChaptersReleased: 0,
        translatorId: interaction.member.id,
        editor: editor,
        status: 'Ongoing',
      }).save()
    }

    interaction.editReply(`Registered new novel '${interaction.options.get('novel-name').value}'.`)
  },
}
