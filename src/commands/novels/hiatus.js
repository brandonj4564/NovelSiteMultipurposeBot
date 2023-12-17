const { Novel, User } = require('../../libs/database/models')
const { Client, Interaction, PermissionFlagsBits } = require('discord.js')
const { Op } = require("sequelize");

module.exports = {
  name: 'hiatus',
  description: `Set your status as 'Hiatus'.`,
  devOnly: false,
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
    await interaction.deferReply({ ephemeral: true });

    let user = await User.findOne({ where: { discordSnowflake: interaction.user.id } })
    let novels = await Novel.findAll({ where: { [Op.or]: [{ translatorId: interaction.user.id }, { editor: interaction.user.id }] } })

    if (!user) {
      interaction.editReply("You are not a staff member.")
      return
    }

    await user.update({
      hiatus: true
    })

    for (const n of novels) {
      n.update({
        status: n.status === "Ongoing" ? "Hiatus" : n.status
      })
    }

    interaction.editReply("Successfully set you and all your novels on Hiatus.")
  },
}
