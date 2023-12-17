const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const roles = [
  {
    id: '1140461156570505318',
    label: 'Translator',
  },
  {
    id: '1140461189328027788',
    label: 'Editor',
  },
  {
    id: '1150217104419737641',
    label: 'Staff',
  },
  {
    id: '1150228732984963223',
    label: 'Author',
  },
]

module.exports = async (client) => {
  if (process.env.FIRST_TIME_STARTUP === 'true' && false) {
    try {
      const channel = await client.channels.cache.get('1150271405284405259') // Gets the channel with this ID
      if (!channel) return

      const row = new ActionRowBuilder()
      roles.forEach((role) => {
        row.components.push(new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary))
      })

      await channel.send({
        content: 'Claim or remove a role below.',
        components: [row], // Each row can have a max of 5 buttons
      })
      process.exit // Closes out of the file
    } catch (error) {
      console.log(error)
    }
  }
}
