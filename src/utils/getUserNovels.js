const { User, Novel } = require('../libs/database/models')
const { table } = require('table')
const { Op } = require('sequelize')

module.exports = async (user, drop = false) => {
    let novels
    if (drop) {
        novels = await Novel.findAll({ where: { translatorId: user.discordSnowflake } })
    }
    else {
        novels = await Novel.findAll({ where: { [Op.or]: [{ translatorId: user.discordSnowflake }, { editor: user.discordSnowflake }] }, order: [['status', 'DESC'], ['novelId', 'ASC']] })
    }
    if (!novels) return "Something went wrong, novels is undefined???"

    let message = [['ID', 'Title', 'Chps', 'Updated', 'Original', 'Status']];

    for (const n of novels) {
        if (drop) {
            if (n.status === "Ongoing" || n.status === "Hiatus") {
                await n.update({
                    status: "Dropped"
                })
                const row = [n.novelId, n.novelTitle.length > 35 ? n.novelTitle.substring(0, 32) + "..." : n.novelTitle, n.numChaptersReleased, n.lastUpdated, n.original ? "Original" : "Not Orig", n.status]
                message.push(row)
            }

        }
        else {
            const row = [n.novelId, n.novelTitle.length > 35 ? n.novelTitle.substring(0, 32) + "..." : n.novelTitle, n.numChaptersReleased, n.lastUpdated, n.original ? "Original" : "Not Orig", n.status]
            message.push(row)
        }
    }

    let dataTable = drop ? "Dropped these novels: \n" + table(message) : table(message)

    return dataTable
}
