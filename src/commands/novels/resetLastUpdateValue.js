const { User } = require('../../libs/database/models')
const { Client, Interaction } = require('discord.js')
const syncStaffNovelDB = require('../../libs/database/syncStaffNovelDB')

module.exports = {
    name: 'reset-last-update',
    description: `Sets everybody's lastUpdate value to null.`,
    devOnly: true,
    // testOnly: Boolean,
    deleted: false,

    /**
     * This gives me information about my parameters in VSCode
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const staff = await User.findAll();
        for (const member of staff) {
            member.dateLastRelease = null;
            member.save();
        }

        await syncStaffNovelDB(client)

        interaction.editReply(`All dates are reset and set again.`)
    },
}
