const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')

module.exports = {
  name: 'update-novel',
  description: `Updates a novel's information.`,
  devOnly: true,
  // testOnly: Boolean,
  options: [
    {
      name: 'novel-id',
      description: 'The ID of the novel, as listed on the website.',
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
    {
      name: 'updated-name',
      description: 'The new name of the novel, in English. Case sensitive.',
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'translator',
      description: 'The new translator of the novel. Do not ping more than one person for this.',
      required: false,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'editor',
      description: 'The new editor of the novel, if there is one. Do not ping more than one person for this.',
      required: false,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'status',
      description: 'The status of the novel.',
      required: false,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'Ongoing',
          value: 'Ongoing',
        },
        {
          name: 'Completed',
          value: 'Completed',
        },
        {
          name: 'Hiatus',
          value: 'Hiatus',
        },
        {
          name: 'Dropped',
          value: 'Dropped',
        },
      ],
    },
    {
      name: 'original',
      description: 'Whether or not the novel is an original.',
      required: false,
      type: ApplicationCommandOptionType.Boolean,
      choices: [
        {
          name: 'True',
          value: true,
        },
        {
          name: 'False',
          value: false,
        },
      ],
    },
    {
      name: 'role',
      description: 'The role of the novel in the server, to be pinged when a new chapter is released.',
      required: false,
      type: ApplicationCommandOptionType.Role,
    },
    {
      name: 'date-last-update',
      description: 'The date this novel was last updated. Format: YYYY-MM-DD',
      required: false,
      type: ApplicationCommandOptionType.String,
    }
  ],
  deleted: false,
  // permissionsRequired: [PermissionFlagsBits.Administrator],
  // botPermissions: [PermissionFlagsBits.Administrator],

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const id = interaction.options.get('novel-id').value
    const newName = interaction.options.get('new-name')?.value || null
    const editor = interaction.options.get('editor')?.value || null
    const translator = interaction.options.get('translator')?.value || null
    const status = interaction.options.get('status')?.value || null
    const role = interaction.options.get('role')?.value || null
    const lastUpdate = interaction.options.get('date-last-update')?.value || null

    // Checks if there already is a novel in the db with the same name
    let novel = await Novel.findOne({
      where: { novelId: id },
    })

    if (!novel) {
      interaction.editReply(`Could not find novel with ID '${id}' in the database.`)
      return
    }

    let original
    if (interaction.options.get('original') == null) {
      original = novel.original
    }
    else {
      original = interaction.options.get('original').value
    }

    await novel.update({
      novelTitle: newName ? newName : novel.novelTitle,
      translatorId: translator ? translator : novel.translatorId,
      editor: editor ? editor : novel.editor,
      original: original,
      status: status ? status : novel.status,
      role: role ? role : novel.role,
      lastUpdated: lastUpdate ? new Date(lastUpdate) : novel.lastUpdated,
    })

    await syncStaffNovelDB(client)

    interaction.editReply(`Updated novel '${novel.novelTitle}'.`)
  },
}
