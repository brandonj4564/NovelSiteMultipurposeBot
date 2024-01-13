const { Novel, Author, Editor, Translator, User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { table } = require('table')

module.exports = {
  name: 'get-database-info',
  description: `Gets the database information straight from the source. Very scuffed.`,
  devOnly: true,
  options: [
    {
      name: 'database',
      description: 'The database you want to see.',
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'Novels',
          value: 'Novels',
        },
        {
          name: 'Authors',
          value: 'Authors',
        },
        {
          name: 'Translators',
          value: 'Translators',
        },
        {
          name: 'Editors',
          value: 'Editors',
        },
        {
          name: 'Staff',
          value: 'Staff',
        },
      ],
    },
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
    await interaction.deferReply()
    const channel = interaction.channel

    const database = interaction.options.get('database').value

    let reply = []

    if (database === 'Novels') {
      const allNovels = await Novel.findAll({ order: [['status', 'DESC'], ['novelId', 'ASC']] })

      reply.push(['ID', 'Title', 'Chapters', 'Translator', 'Discord Tag', 'Editor', 'Status', 'Updated', 'Original', 'Role'])
      for (const n of allNovels) {
        const user = await User.findOne({ where: { discordSnowflake: n.translatorId } })
        let editor;
        if (n.editor) {
          const e = await User.findOne({ where: { discordSnowflake: n.editor } })
          editor = e.discordUsername
        }

        const row = [n.novelId, n.novelTitle.length > 35 ? n.novelTitle.substring(0, 32) + "..." : n.novelTitle, n.numChaptersReleased, n.translatorUsername, user ? user.discordUsername : "Unknown", n.editor ? editor : "N/A", n.status, n.lastUpdated, n.original ? "Original" : "Not Original", n.role ? "Yes" : "No"]
        reply.push(row)
      }
    } else if (database === 'Authors') {
      const allAuthors = await Author.findAll({ order: [['numChapterReleases', 'DESC']] })
      reply.push(['ID', 'Discord', 'Novels', 'Releases'])

      for (const a of allAuthors) {
        const row = [a.authorId, a.discordUsername, a.numProjects, a.numChapterReleases]
        reply.push(row)
      }
    } else if (database === 'Translators') {
      const allTranslators = await Translator.findAll({ order: [['numChapterReleases', 'DESC']] })
      reply.push(['ID', 'Discord', 'Novels', 'Releases'])

      for (const a of allTranslators) {
        const row = [a.translatorId, a.discordUsername, a.numProjects, a.numChapterReleases]
        reply.push(row)
      }
    } else if (database === 'Editors') {
      const allEditors = await Editor.findAll({ order: [['numChapterReleases', 'DESC']] })
      reply.push(['ID', 'Discord', 'Novels', 'Releases'])

      for (const a of allEditors) {
        const row = [a.editorId, a.discordUsername, a.numProjects, a.numChapterReleases]
        reply.push(row)
      }
    } else if (database === 'Staff') {
      const allStaff = await User.findAll({ order: [['retired', 'DESC'], ['dateLastRelease', 'ASC']] })
      reply.push(['Snowflake', 'Discord', 'Username', 'Active', 'Hiatus', 'Retired'])

      for (const a of allStaff) {
        const row = [a.discordSnowflake, a.discordUsername, a.websiteUsername, a.dateLastRelease ? a.dateLastRelease : "Never Posted", a.retired ? "Retired" : (a.hiatus ? "Hiatus" : "Active"), a.retired ? "Retired" : "Active"]
        reply.push(row);
      }
    }

    let dataTable = table(reply) + ""

    if (dataTable.length > 2000) {
      // scuffed lol
      const endRowIndex = dataTable.substring(1600).indexOf('║') + 1601
      interaction.editReply("```" + dataTable.substring(0, endRowIndex) + "```")
      for (let i = 1; i < dataTable.length / endRowIndex; i++) {
        channel.send("```" + dataTable.substring(i * endRowIndex + i, (i + 1) * endRowIndex + i) + "```")
      }
    } else {
      interaction.editReply("```" + dataTable + "```")
    }
  },
}
