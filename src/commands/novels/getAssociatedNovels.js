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

        let novels = await Novel.findAll({ where: { translatorId: user } })
        let message = "```Associated novels: \n";

        for (const n of novels) {

            if (n.novelTitle.length > 50) {
                message += 'ID: ' + n.novelId + ' | Title: ' + n.novelTitle.substring(0, 47) + '...\n'
            }
            else {
                message += 'ID: ' + n.novelId + ' | Title: ' + n.novelTitle + '\n'
            }

        }
        if (novels.length == 0) {
            message += 'None'
        }
        message += "```"

        interaction.editReply(message)
    },
}
