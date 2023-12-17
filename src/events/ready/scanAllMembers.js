const { User, Translator, Author, Editor } = require('../../libs/database/models')
const syncStaffNovelDB = require('../../libs/database/syncStaffNovelDB')

module.exports = async (client) => {
  if (process.env.FIRST_TIME_STARTUP === 'true') {
    try {
      // Scans all members in the server and, based on their roles, checks the DB for up to date information
      const guild = await client.guilds.cache.get(process.env.GUILD_ID)
      const members = await guild.members.fetch()

      const staffRole = process.env.STAFF_ROLE // Temp staff role, change to actual staff role when implemented
      const translatorRole = process.env.TRANSLATOR_ROLE
      const MTLTranslatorRole = process.env.MTLTRANSLATOR_ROLE
      const editorRole = process.env.EDITOR_ROLE
      const authorRole = process.env.AUTHOR_ROLE

      // const members = await guild.roles.cache.get(staffRole).members

      const staff = await User.findAll({ attributes: ['discordSnowflake'] }) // Get a list of all discord snowflakes registered to staff
      const scannedStaffSnowflakes = []

      for (const member of members) {
        if (member[1].roles.cache.has(staffRole)) {
          const snowflake = member[1].user.id
          scannedStaffSnowflakes.push(snowflake)
          const username = member[1].user.username
          let user = await User.findOne({ where: { discordSnowflake: snowflake } })

          if (!user) {
            user = await new User({
              discordSnowflake: snowflake,
              discordUsername: username,
              websiteUsername: 'Unknown',
            }).save()
          }

          if (member[1].roles.cache.has(translatorRole) || member[1].roles.cache.has(MTLTranslatorRole)) {
            let translator = await Translator.findOne({ where: { translatorId: snowflake } })

            if (!translator) {
              translator = await new Translator({
                translatorId: snowflake,
                discordUsername: username,
              }).save()
            }
          }

          if (member[1].roles.cache.has(editorRole)) {
            let editor = await Editor.findOne({ where: { editorId: snowflake } })

            if (!editor) {
              editor = await new Editor({
                editorId: snowflake,
                discordUsername: username,
              }).save()
            }
          }

          if (member[1].roles.cache.has(authorRole)) {
            let author = await Author.findOne({ where: { authorId: snowflake } })

            if (!author) {
              author = await new Author({
                authorId: snowflake,
                discordUsername: username,
              }).save()
            }
          }
        }
      }

      for (let s of staff) {
        // This will check the entire DB and see if any staff members are no longer registered as staff on the Discord server, and then will set them to RETIRED
        const snowflake = s.dataValues.discordSnowflake
        let user = await User.findOne({ where: { discordSnowflake: snowflake } })

        if (!scannedStaffSnowflakes.includes(snowflake)) {
          user.update({ retired: true })
        }
      }

      await syncStaffNovelDB(client)

      process.exit // Closes out of the file
    } catch (error) {
      console.log(error)
    }
  }
}
