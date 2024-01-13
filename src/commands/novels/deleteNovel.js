const { Novel } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')

module.exports = {
    name: 'delete-novel',
    description: 'Deletes a novel from the database.',
    devOnly: true,
    // testOnly: Boolean,
    options: [
        {
            name: 'novel-id',
            description: 'The ID of the novel, as listed on the website.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    deleted: false,

    /**
     * This gives me information about my parameters in VSCode
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply()

        const id = interaction.options.get('novel-id').value

        let novel = await Novel.findOne({
            where: { novelId: id },
        })

        if (!novel) {
            interaction.editReply(`Could not find novel with ID '${id}' in the database.`)
            return
        }

        const title = novel.novelTitle;
        await novel.destroy();

        await syncStaffNovelDB(client)

        interaction.editReply(`Deleted novel '${title}' from the database. Please also delete the novel on the website as well.`)
    },
}
