const fs = require('fs')
const path = require('path')

module.exports = (directory, foldersOnly = false) => {
  // foldersOnly is default set to false
  let fileNames = []

  const files = fs.readdirSync(directory, { withFileTypes: true })

  for (const file of files) {
    const filePath = path.join(directory, file.name)

    if (foldersOnly) {
      if (file.isDirectory()) {
        // is the file a folder?
        fileNames.push(filePath)
      }
    } else if (file.isFile()) {
      // is the file an actual file?
      fileNames.push(filePath)
    }
  }

  return fileNames
}
