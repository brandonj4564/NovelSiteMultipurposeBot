const { User, Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const { table } = require('table')

module.exports = {
    name: 'get-associated-novels',
    description: `Gets the novels associated with a user.`,
    devOnly: false,
    // testOnly: Boolean,
    deleted: false,
    //   permissionsRequired: [PermissionFlagsBits.Administrator],
    //botPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'user',
            description: 'The staff member associated with the novels.',
            required: true,
            type: ApplicationCommandOptionType.User,
        },],

    /**
     * This gives me information about my parameters in VSCode
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const channel = interaction.channel
        await interaction.deferReply();

        const user = interaction.options.get('user').value
        let staff = await User.findOne({ where: { discordSnowflake: user } })

        if (!staff) {
            interaction.editReply("That's not a valid staff member.")
        }

        let novels = await Novel.findAll({ where: { translatorId: user }, order: [['status', 'DESC'], ['novelId', 'ASC']] })

        let message = [['ID', 'Title', 'Chps', 'Updated', 'Original', 'Status']];

        for (const n of novels) {
            const row = [n.novelId, n.novelTitle.length > 35 ? n.novelTitle.substring(0, 32) + "..." : n.novelTitle, n.numChaptersReleased, n.lastUpdated, n.original ? "Original" : "Not Orig", n.status]
            message.push(row)
        }

        let dataTable = table(message) + ""

        if (dataTable.length > 2000) {
            const rowLength = dataTable.indexOf('║')
            let endRowIndex = rowLength
            while (endRowIndex < 1800) {
                endRowIndex += rowLength
            }
            interaction.editReply("```" + dataTable.substring(0, endRowIndex) + "```")
            for (let i = 1; i < dataTable.length / endRowIndex; i++) {
                channel.send("```" + dataTable.substring(i * endRowIndex, (i + 1) * endRowIndex) + "```")
            }
        } else {
            interaction.editReply("```" + dataTable + "```")
        }
    },
}
