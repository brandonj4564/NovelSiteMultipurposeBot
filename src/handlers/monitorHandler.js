const getMonitors = require('../utils/getMonitors')
const webScraperHandler = require('./webScraperHandler')
const { User, Novel } = require('../libs/database/models')
const getUserNovels = require('../utils/getUserNovels')
const sendTableMessage = require('../utils/sendTableMessage')

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
                let novels = await Novel.findAll({ where: { translatorId: snowflake } })

                for (const n of novels) {
                    if (n.status === "Ongoing") {
                        await n.update({
                            status: "Dropped"
                        })
                    }
                }
            }
        }

        const allStaff = await User.findAll()
        const channel = await client.channels.cache.get('1154633704442953728') // Bot testing channel in Luminary Discord
        for (const a of allStaff) {
            if (!a.retired) {
                if (a.dateLastRelease && (new Date()) - new Date(a.dateLastRelease) > 2629800000 * 3) {
                    // Last updated over three months ago
                    await a.update({
                        retired: true,
                        dateRetired: new Date(),
                    })
                    const dataTable = await getUserNovels(a, true)

                    if (channel) {
                        await channel.send(`**${a.discordUsername}** has been inactive for more than 3 months, automatically retired. <@327670614351413270>, please remove their staff roles.`)
                        sendTableMessage(dataTable, channel)
                    }
                }
            }
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
