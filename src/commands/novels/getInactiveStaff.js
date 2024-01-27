const { User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const { table } = require('table')
const sendTableMessage = require('../../utils/sendTableMessage')

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
          // const row = ['REGISTER', a.discordUsername, a.websiteUsername, a.dateLastRelease]
          const row = ['REGISTER', a['discordUsername'], a['websiteUsername'], a['dateLastRelease']]
          reply.push(row)
        } else if (a.hiatus) {
          const row = ['HIATUS', a['discordUsername'], a['websiteUsername'], a['dateLastRelease']]
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
    sendTableMessage(inactiveTable, channel, interaction)
  },
}
