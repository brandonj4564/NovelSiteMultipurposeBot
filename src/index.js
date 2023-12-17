require('dotenv').config() // Gives me access to my .env file
const endlessMonitor = require('./endlessMonitor.js')
const eventHandler = require('./handlers/eventHandler.js')
const getLocalCommands = require('./utils/getLocalCommands.js')

const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
} = require('discord.js')

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

const status = [
  // A potential list of statuses the bot can cycle through
  {
    name: 'The True Son of Braindean',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=j4AkYhPa3vs',
  },
  {
    name: 'First Progeny of the Seventh Dean',
    type: ActivityType.Playing,
  },
  {
    name: 'Disinherited Child',
    type: ActivityType.Watching,
  },
]

// client.on('ready', (c) => {
//   // try {
//   //   const channel = await client.channels.cache.get('1140130632391999551') // Gets the channel with this ID
//   //   if (!channel) return

//   //   const row = new ActionRowBuilder()
//   //   roles.forEach((role) => {
//   //     row.components.push(new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary))
//   //   })

//   //   await channel.send({
//   //     content: 'Claim or remove a role below.',
//   //     components: [row], // Each row can have a max of 5 buttons
//   //   })
//   //   process.exit // Closes out of the file
//   // } catch (error) {
//   //   console.log(error)
//   // }

//   // I don't need to constantly resend this message with buttons, every button interaction counts

//   console.log(`Logged in as ${c.user.tag}!`)

//   // This rotating status code does not function
//   // setInterval(() => {
//   //   const random = Math.floor(Math.random() * status.length)
//   //   client.user.setActivity(status[random])
//   // }, 5000)

//   client.user.setActivity({
//     name: 'The True Son of Braindean',
//     type: ActivityType.Playing,
//   })
// })

// client.on('messageCreate', (msg) => {
//   if (msg.author.bot) {
//     // Ensure there are no infinite loops
//     return
//   }
//   if (msg.content == 'hey') msg.reply('buffoon')
//   else {
//     msg.channel.send(msg.content)
//   }
// })

// client.on('interactionCreate', async (interaction) => {
//   try {
//     // if (!interaction.isChatInputCommand()) return // Only runs the below code if the interaction is a slash command
//     if (!interaction.isChatInputCommand() && !interaction.isButton()) return // Only runs the below code if the interaction is a slash command or a button

//     if (interaction.commandName === 'hey') {
//       interaction.reply('hey!')
//     }

//     if (interaction.commandName === 'add') {
//       const num1 = interaction.options.get('first-number').value // Get options by name in the commands list
//       const num2 = interaction.options.get('second-number').value // If the option is not required, you have to check if the option exists

//       interaction.reply(num1 + num2 + '')
//     }

//     if (interaction.commandName === 'choices') {
//       const choice = interaction.options.get('your-choice').value
//       interaction.reply('Your choice is: ' + choice)
//     }

//     if (interaction.commandName === 'embed') {
//       const embed = new EmbedBuilder()
//         .setTitle('Embed Title')
//         .setDescription('This is a description.')
//         .setColor('Random')
//         .addFields(
//           { name: 'Field title', value: 'Some random value', inline: true },
//           { name: 'Field title 2', value: 'Some other random value', inline: true }
//         )

//       interaction.reply({ embeds: [embed] })
//     }

//     if (interaction.isButton()) {
//       await interaction.deferReply({ ephemeral: true }) // Adds a cool little thing that says the bot is thinking...

//       const role = interaction.guild.roles.cache.get(interaction.customId)
//       if (!role) {
//         interaction.editReply({
//           // Edits the 'Bot is thinking' message instead of creating a new one. The ephemeral option just means the message is only viewable by you
//           content: 'I could not find that role.',
//         })
//         return
//       }

//       const hasRole = interaction.member.roles.cache.has(role.id) // User already has the role

//       if (hasRole) {
//         await interaction.member.roles.remove(role)
//         await interaction.editReply(`The role ${role} has been removed.`)
//         return
//       }

//       await interaction.member.roles.add(role)
//       await interaction.editReply(`The role ${role} has been added.`)
//     }
//   } catch (error) {
//     console.log(error)
//   }
// })

eventHandler(client) // Handle all events
endlessMonitor(client)

client.login(process.env.TOKEN)
