const monitorHandler = require('../../handlers/monitorHandler')

module.exports = async (client) => {
    await monitorHandler(client)
}
