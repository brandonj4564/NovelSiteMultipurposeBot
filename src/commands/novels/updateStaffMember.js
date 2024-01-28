const { User } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')

module.exports = {
  name: 'update-staff',
  description: `Updates a staff member's information.`,
  devOnly: true,
  // testOnly: Boolean,
  options: [
    {
      name: 'staff-member',
      description: 'The user you are updating.',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'website-username',
      description: `The username this user has on the Luminary Novels website.`,
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'hiatus',
      description: 'Whether or not the user is on a hiatus.',
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

    const member = interaction.options.get('staff-member').value

    let user = await User.findOne({
      where: { discordSnowflake: member },
    })

    if (!user) {
      interaction.editReply(`That's not a staff member.`)
      return
    }

    const websiteName = interaction.options.get('website-username')?.value || user.websiteName
    let hiatus
    if (interaction.options.get('hiatus') == null) {
      hiatus = user.hiatus
    }
    else {
      hiatus = interaction.options.get('hiatus').value
    }

    await user.update({
      websiteUsername: websiteName,
      hiatus: hiatus,
    })

    await syncStaffNovelDB(client)
    // const memberName = (await client.guilds.cache.get(process.env.GUILD_ID).members.fetch(member)).nickname

    interaction.editReply(`Updated user '${member}'.`)
  },
}
