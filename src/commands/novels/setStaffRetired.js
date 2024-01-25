const { User, Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const { table } = require('table')
const getDroppedNovels = require('../../utils/getDroppedNovels')

module.exports = {
    name: 'set-retired',
    description: `Retires a staff member, and sets all their novels to dropped.`,
    devOnly: true,
    // testOnly: Boolean,
    deleted: false,
    //   permissionsRequired: [PermissionFlagsBits.Administrator],
    //botPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'user',
            description: 'The staff member to be retired.',
            type: ApplicationCommandOptionType.User,

        },
        {
            name: 'user-name',
            description: 'The Discord name of the staff member.',
            type: ApplicationCommandOptionType.String,
        },],

    /**
     * This gives me information about my parameters in VSCode
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const channel = interaction.channel
        await interaction.deferReply();

        const user = interaction.options.get('user')?.value || null
        const name = interaction.options.get('user-name')?.value || null

        // Checks if there already is a novel in the db with the same name
        let staff;
        if (user) {
            staff = await User.findOne({ where: { discordSnowflake: user } })
        }
        else if (name) {
            staff = await User.findOne({
                where: { discordUsername: name },
            })
        }
        else {
            interaction.editReply('You must ping a user or supply their name.')
            return
        }

        if (!staff) {
            interaction.editReply('I could not find that staff member in the database.')
            return
        }
        await staff.update({ retired: true })

        // Actually, don't set novels where the staff member is just the editor as "Dropped",
        // maybe they got a new editor?
        // let novels = await Novel.findAll({ where: { [Op.or]: [{ translatorId: staff.discordSnowflake }, { editor: staff.discordSnowflake }] } })

        const dataTable = await getDroppedNovels(staff, true)

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
