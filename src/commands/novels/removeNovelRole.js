const { Novel } = require('../../libs/database/models')
const { Client, Interaction, PermissionFlagsBits } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')
const { Op } = require('sequelize')

module.exports = {
  name: 'remove-inactive-roles',
  description: `Removes all dropped/completed novels' associated roles.`,
  devOnly: true,
  // testOnly: Boolean,
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

    // Checks if there already is a novel in the db with the same name
    const novels = await Novel.findAll({
      where: {
        [Op.or]: [
          { status: 'Completed' },
          { status: 'Dropped' },
        ]
      }
    })

    let message = '```Removed roles for these novels: \n'
    for (const n of novels) {
      if (n.role) {
        await n.update({
          role: null
        })

        if (n.novelTitle.length > 50) {
          message += 'ID: ' + n.novelId + ' | Title: ' + n.novelTitle.substring(0, 47) + '...\n'
        }
        else {
          message += 'ID: ' + n.novelId + ' | Title: ' + n.novelTitle + '\n'
        }
      }
    }

    if (novels.length == 0) {
      message += 'None'
    }
    message += "```"

    await syncStaffNovelDB(client)

    interaction.editReply(message)
  },
}
