const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')

const commands = [
  {
    name: 'hey',
    description: 'Replies with hey!',
  },
  {
    name: 'add',
    description: 'Adds two numbers.',
    options: [
      // Options for input in a command
      {
        name: 'first-number', // Names cannot have spaces
        description: 'The first number.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: 'second-number',
        description: 'The second number.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  {
    name: 'choices',
    description: 'You can choose!',
    options: [
      // Options for input in a command
      {
        name: 'your-choice',
        description: 'The choice you shall make.',
        type: ApplicationCommandOptionType.Number,
        choices: [
          {
            name: 'one',
            value: 1,
          },
          {
            name: 'two',
            value: 2,
          },
        ],
        required: true,
      },
    ],
  },
  {
    name: 'embed',
    description: 'Sends an embed.',
  },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

;(async () => {
  // An anonymous asynchronous function that gets run automatically upon executing this file, which registers a list of slash commands for the bot
  try {
    console.log('Registering slash commands...')

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands,
    })

    console.log('Slash commands were registered successfully.')
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
})()
