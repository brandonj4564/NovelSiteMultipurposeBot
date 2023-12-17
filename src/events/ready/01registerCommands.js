const { testServer } = require('../../../config.json')
const areCommandsDifferent = require('../../utils/areCommandsDifferent')
const getApplicationCommands = require('../../utils/getApplicationCommands')
const getLocalCommands = require('../../utils/getLocalCommands')

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands()
    const applicationCommands = await getApplicationCommands(client, testServer)

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand

      const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name)
      // checks if there's some application command with the same exact name as a local command
      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id)
          console.log(`🗑 Deleted command "${name}".`)
          continue
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          })
          console.log(`🔁 Edited command "${name}".`)
        }
      } else {
        if (localCommand.deleted) {
          console.log(`⏩ Skipping registering command "${name}" as it's set to delete.`)
          continue
        }

        // Only runs if the command does not exist and is not set to be deleted, therefore creating the command
        await applicationCommands.create({
          name,
          description,
          options,
        })

        console.log(`👍 Registered command "${name}."`)
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
}
