const path = require('path')
const getAllFiles = require('../utils/getAllFiles')

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true) // A list of all the folders inside the 'events' directory

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder) // Only gets all the files
    eventFiles.sort((a, b) => a > b) // Sorts the files

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop() // Replaces all backslashes with forward slashes, splits where the forward slashes are, and pops the last item in the array (which is the name)

    client.on(eventName, async (arg) => {
      // Abstracts the handling of events
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile)
        await eventFunction(client, arg)
      }
    })
  }
}
