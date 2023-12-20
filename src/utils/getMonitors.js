const path = require('path')
const getAllFiles = require('./getAllFiles')

module.exports = (exceptions = []) => {
  let monitors = []

  const allMonitors = getAllFiles(path.join(__dirname, '../handlers/serverFiles', 'monitors'))

  for (const m of allMonitors) {
    const monitorObject = require(m)

    if (exceptions.includes(monitorObject.name)) {
      continue // skip this iteration of the loop if the command is an exception
    }
    monitors.push(monitorObject)
  }

  return monitors
}
