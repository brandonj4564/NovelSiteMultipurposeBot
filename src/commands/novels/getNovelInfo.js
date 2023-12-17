const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'get-novel-info',
  description: `Gets a novel's information. You must supply either the novel ID or name.`,
  options: [
    {
      name: 'novel-id',
      description: 'The ID of the novel, as listed on the website.',
      type: ApplicationCommandOptionType.Number,
    },
    {
      name: 'novel-name',
      description: 'The name of the novel, in English. Case sensitive.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const name = interaction.options.get('novel-name')?.value || null
    const id = interaction.options.get('novel-id')?.value || null

    // Checks if there already is a novel in the db with the same name
    let novel;
    if (id) {
      novel = await Novel.findOne({ where: { novelId: id } })
    }
    else if (name) {
      novel = await Novel.findOne({
        where: { novelTitle: name },
      })
    }
    else {
      interaction.editReply('You must supply an ID or name.')
      return
    }

    if (!novel) {
      interaction.editReply(`Could not find that novel in the database.`)
      return
    }

    const translator = novel.translatorUsername;

    const embed = new EmbedBuilder()
      .setTitle(`${novel.novelTitle}`)
      .setColor('Random')
      .addFields(
        { name: 'ID', value: novel.novelId + '', inline: false },
        { name: 'Translator', value: translator + '', inline: true },
        { name: 'Chapters Released', value: novel.numChaptersReleased + '', inline: true },
        { name: 'Date Last Release', value: novel.lastUpdated + '', inline: false },
        { name: 'Status', value: novel.status + '', inline: true }
      )

    interaction.editReply({ embeds: [embed] })
  },
}
