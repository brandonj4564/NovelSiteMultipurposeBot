const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require('discord.js')

module.exports = {
  name: 'ban',
  description: 'Bans a member!!!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  deleted: true,
  options: [
    {
      name: 'target-user',
      description: 'The user you want to be banned.',
      required: true,
      type: ApplicationCommandOptionType.User, // Mentionable is like, all users who can be MENTIONED in @
    },
    {
      name: 'reason',
      description: 'The reason for banning.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value
    const reason = interaction.options.get('reason')?.value || 'No reason provided.'

    await interaction.deferReply()

    const targetUser = await interaction.guild.members.fetch(targetUserId)

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.")
      return
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't ban the server owner!")
      return
    }

    const targetUserRolePosition = targetUser.roles.highest.position // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't ban that user because they have the same/higher role than you.")
      return
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't ban that user because they have the same/higher role than me.")
      return
    }

    // Ban the targetUser
    // KNOWN ERROR: CommandOptionType.Mentionable INCLUDES ROLES SINCE THEY ARE MENTIONABLE, BUT YOU CANNOT BAN A ROLE OBVIOUSLY SO THE BOT BREAKS
    try {
      await targetUser.ban({ reason })
      await interaction.editReply(`User ${targetUser} was banned. \n Reason for banning: ${reason}`)
    } catch (error) {
      console.log(`There was an error when banning: ${error}`)
    }
  },
}
