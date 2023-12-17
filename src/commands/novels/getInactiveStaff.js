const { User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const { table } = require('table')

module.exports = {
  name: 'inactive',
  description: `Gets a list of all inactive or unregistered Discord staff members.`,
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

    let reply = []
    const allStaff = await User.findAll()

    reply.push(['Reason', 'Discord', 'Website Name', 'Last Post'])

    for (const a of allStaff) {
      if (!a.retired) {
        if (!a.websiteUsername || !a.dateLastRelease) {
          const row = ['REGISTER', a.discordUsername, a.websiteUsername, a.dateLastRelease]
          reply.push(row)
        } else if (a.hiatus) {
          const row = ['HIATUS', a.discordUsername, a.websiteUsername, a.dateLastRelease]
          reply.push(row)
        }
        else if (a.dateLastRelease && (new Date()) - new Date(a.dateLastRelease) > 2629800000) {
          // Last updated over a month ago
          const row = ['INACTIVE', a.discordUsername, a.websiteUsername, a.dateLastRelease]
          reply.push(row)
        }
      }
    }

    let inactiveTable = table(reply) + ""

    if (inactiveTable.length > 2000) {
      // scuffed lol
      const endRowIndex = inactiveTable.substring(1600).indexOf('║') + 1600
      interaction.editReply("```" + inactiveTable.substring(0, endRowIndex) + "```")
      for (let i = 1; i < inactiveTable.length / endRowIndex; i++) {
        channel.send("```" + inactiveTable.substring(i * endRowIndex, (i + 1) * endRowIndex) + "```")
      }
    } else {
      interaction.editReply("```" + inactiveTable + "```")
    }
  },
}
