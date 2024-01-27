module.exports = (dataTable, channel, interaction = null) => {
    try {
        if (dataTable.length > 2000) {
            const rowLength = dataTable.indexOf('║')
            let endRowIndex = rowLength
            while (endRowIndex < 1800) {
                endRowIndex += rowLength
            }

            if (interaction) {
                interaction.editReply("```" + dataTable.substring(0, endRowIndex) + "```")
            }
            else {
                channel.send("```" + dataTable.substring(0, endRowIndex) + "```")
            }

            for (let i = 1; i < dataTable.length / endRowIndex; i++) {
                channel.send("```" + dataTable.substring(i * endRowIndex, (i + 1) * endRowIndex) + "```")
            }
        } else {
            if (interaction) {
                interaction.editReply("```" + dataTable + "```")
            }
            else {
                channel.send("```" + dataTable + "```")
            }
        }
    } catch (error) {
        console.log("Something went wrong printing your data table: " + error)
    }

}
