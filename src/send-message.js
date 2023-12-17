const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

const roles = [
  {
    id: '1140461156570505318',
    label: 'Blue',
  },
  {
    id: '1140461189328027788',
    label: 'Green',
  },
]

// DEFUNCT, DELETE LATER

client.on('ready', async (c) => {
  try {
    const channel = await client.channels.cache.get('1140130632391999551') // Gets the channel with this ID
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

  console.log(`Logged in as ${c.user.tag}!`)
})

client.login(process.env.TOKEN)
