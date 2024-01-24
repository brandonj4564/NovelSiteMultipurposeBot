const { User, Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const { table } = require('table')

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

        // const user = interaction.options.get('user').value
        // let staff = await User.findOne({ where: { discordSnowflake: user } })

        // if (!staff) {
        //     interaction.editReply("That's not a valid staff member.")
        // }
        // await staff.update({ retired: true })

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

        let novels = await Novel.findAll({ where: { translatorId: staff.discordSnowflake } })
        let message = "```Dropped novels: \n";

        for (const n of novels) {
            if (n.status === "Ongoing") {
                await n.update({
                    status: "Dropped"
                })

                if (n.novelTitle.length > 50) {
                    message += 'ID: ' + n.novelId + ' | Title: ' + n.novelTitle.substring(0, 47) + '...\n'
                }
                else {
                    message += 'ID: ' + n.novelId + ' | Title: ' + n.novelTitle + '\n'
                }
            }
        }
        if (novels.length == 0) {
            message += 'None'
        }
        message += "```"

        interaction.editReply(message)
    },
}
