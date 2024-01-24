const getMonitors = require('../utils/getMonitors')
const webScraperHandler = require('./webScraperHandler')
const { User } = require('../libs/database/models')

const activateMonitors = async (client) => {
    try {
        const monitors = getMonitors()
        const staffNotFoundLists = []
        for (const m of monitors) {
            // The run callback function returns a list of staff members that are present in the DB but not in any server,
            // which means the staff member could have left. 
            const list = await m.run(client)
            staffNotFoundLists.push(list)
        }

        const missingStaff = staffNotFoundLists.reduce((common, currentArray) => {
            return common.filter(value => currentArray.includes(value));
        }, staffNotFoundLists[0]);

        for (const snowflake of missingStaff) { // Retires the missing staff from both servers. This assumes they just left.
            const user = await User.findOne({ where: { discordSnowflake: snowflake } })
            if (user) {
                user.update({ retired: true })
            }
        }

        await webScraperHandler(client)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = async (client) => {
    await activateMonitors(client)

    const interval = setInterval(activateMonitors, 1800000, client) // 30 minutes timer
    // const interval = setInterval(activateMonitors, 100, client, monitors) // 30 / 2 minutes timer
}
