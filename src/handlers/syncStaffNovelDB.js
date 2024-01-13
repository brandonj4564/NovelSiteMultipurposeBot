const { Novel, User, Translator, Author, Editor } = require('../libs/database/models')
const getAllFiles = require('../utils/getAllFiles')
const fs = require('fs');
const path = require('path');

const syncStaffServerNovelDB = async (client, data) => {
  // Synchronizes data such as numChapterReleases between all the DBs. The translators and editors associated with each novel will calculate their numChaptersReleased and numProjects based on the novel DB.
  const guild = await client.guilds.cache.get(data.GUILD_ID)
  const members = await guild.members.fetch()
  const staffRole = data.STAFF_ROLE
  const translatorRole = data.TRANSLATOR_ROLE
  const MTLTranslatorRole = data.MTLTRANSLATOR_ROLE
  const editorRole = data.EDITOR_ROLE
  const authorRole = data.AUTHOR_ROLE

  for (const member of members) {
    if (member[1].roles.cache.has(staffRole)) {
      const snowflake = member[1].user.id
      const username = member[1].user.username
      let user = await User.findOne({ where: { discordSnowflake: snowflake } })
      let translatorUsername = null

      if (!user) {
        user = await new User({
          discordSnowflake: snowflake,
          discordUsername: username,
          websiteUsername: 'Unknown',
        }).save()
      }

      let dateLastRelease = user.dateLastRelease

      if (member[1].roles.cache.has(translatorRole) || member[1].roles.cache.has(MTLTranslatorRole)) {
        let translator = await Translator.findOne({ where: { translatorId: snowflake } })

        if (!translator) {
          translator = await new Translator({
            translatorId: snowflake,
            discordUsername: username,
          }).save()
        }

        const novels = await Novel.findAll({ where: { translatorId: snowflake } })
        let totalProjects = 0
        let totalChapters = 0

        for (const n of novels) {
          totalChapters += n.numChaptersReleased
          totalProjects++
          translatorUsername = n.translatorUsername // Automatically links the website username associated with the novel to the discord profile associated with the discord snowflake

          if (!dateLastRelease) {
            dateLastRelease = n.lastUpdated
          } else {
            if (n.lastUpdated > dateLastRelease) {
              dateLastRelease = n.lastUpdated
            }
          }
        }

        await translator.update({
          numProjects: totalProjects,
          numChapterReleases: totalChapters,
        })
      }

      if (member[1].roles.cache.has(editorRole)) {
        let editor = await Editor.findOne({ where: { editorId: snowflake } })

        if (!editor) {
          editor = await new Editor({
            editorId: snowflake,
            discordUsername: username,
          }).save()
        }

        const novels = await Novel.findAll({ where: { editor: snowflake } })
        let totalProjects = 0
        let totalChapters = 0

        for (const n of novels) {
          totalChapters += n.numChaptersReleased
          totalProjects++

          if (!dateLastRelease) {
            dateLastRelease = n.lastUpdated
          } else {
            if (n.lastUpdated > dateLastRelease) {
              dateLastRelease = n.lastUpdated
            }
          }
        }

        await editor.update({
          numProjects: totalProjects,
          numChapterReleases: totalChapters,
        })
      }

      if (member[1].roles.cache.has(authorRole)) {
        let author = await Author.findOne({ where: { authorId: snowflake } })

        if (!author) {
          author = await new Author({
            authorId: snowflake,
            discordUsername: username,
          }).save()
        }

        const novels = await Novel.findAll({ where: { translatorId: snowflake, original: true } })
        let totalProjects = 0
        let totalChapters = 0

        for (const n of novels) {
          totalChapters += n.numChaptersReleased
          totalProjects++

          if (!dateLastRelease) {
            dateLastRelease = n.lastUpdated
          } else {
            if (n.lastUpdated > dateLastRelease) {
              dateLastRelease = n.lastUpdated
            }
          }
        }

        await author.update({
          numProjects: totalProjects,
          numChapterReleases: totalChapters,
        })
      }

      await user.update({
        websiteUsername: translatorUsername ? translatorUsername : 'Unknown',
        dateLastRelease: dateLastRelease,
      })
    }
  }
}

module.exports = async (client) => {
  const files = fs.readdirSync(path.join(__dirname, '.', 'serverFiles', 'serverInfo'), { withFileTypes: true })

  for (const file of files) {
    const filePath = path.join(__dirname, ".", "serverFiles", "serverInfo", file.name);
    const data = fs.readFileSync(filePath, 'utf-8')
    const serverData = await JSON.parse(data)

    await syncStaffServerNovelDB(client, serverData)
  }
}
