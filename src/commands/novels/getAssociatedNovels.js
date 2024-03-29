const { User, Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const { table } = require('table')
const { Op } = require('sequelize')
const getUserNovels = require('../../utils/getUserNovels')
const sendTableMessage = require('../../utils/sendTableMessage')

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

        // let novels = await Novel.findAll({ where: { [Op.or]: [{ translatorId: user }, { editor: user }] }, order: [['status', 'DESC'], ['novelId', 'ASC']] })

        // let message = [['ID', 'Title', 'Chps', 'Updated', 'Original', 'Status']];

        // for (const n of novels) {
        //     const row = [n.novelId, n.novelTitle.length > 35 ? n.novelTitle.substring(0, 32) + "..." : n.novelTitle, n.numChaptersReleased, n.lastUpdated, n.original ? "Original" : "Not Orig", n.status]
        //     message.push(row)
        // }

        let dataTable = await getUserNovels(staff, false)
        sendTableMessage(dataTable, channel, interaction)
    },
}
