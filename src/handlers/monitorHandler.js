const getMonitors = require('../utils/getMonitors')
const webScraperHandler = require('./webScraperHandler')

const activateMonitors = async (client) => {
    try {
        const monitors = getMonitors()
        for (const m of monitors) {
            await m.run(client)
        }
        await webScraperHandler(client)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = async (client) => {
    // await activateMonitors(client)

    const interval = setInterval(activateMonitors, 1800000, client) // 30 minutes timer
    // const interval = setInterval(activateMonitors, 100, client, monitors) // 30 / 2 minutes timer
}
