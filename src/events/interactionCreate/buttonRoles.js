const { Author, Editor, Translator } = require('../../libs/database/models')

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) {
    return
  }

  await interaction.deferReply({ ephemeral: true }) // Adds a cool little thing that says the bot is thinking...

  const role = interaction.guild.roles.cache.get(interaction.customId)
  if (!role) {
    interaction.editReply({
      // Edits the 'Bot is thinking' message instead of creating a new one. The ephemeral option just means the message is only viewable by you
      content: 'I could not find that role.',
    })
    return
  }

  const hasRole = interaction.member.roles.cache.has(role.id) // User already has the role

  if (hasRole) {
    await interaction.member.roles.remove(role)
    await interaction.editReply(`The role ${role} has been removed.`)
    return
  }

  await interaction.member.roles.add(role)
  await interaction.editReply(`The role ${role} has been added.`)
}
