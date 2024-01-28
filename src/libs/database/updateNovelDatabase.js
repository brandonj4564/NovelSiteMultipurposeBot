const { Novel, User, Coin, View, Chapter } = require('./models')
const syncStaffNovelDB = require('../../handlers/syncStaffNovelDB')
const notifyNewChapters = require('./notifyNewChapters')
const { notify } = require('superagent')

module.exports = async (novelInfo, client, newReleasesChannel) => {
  // novelInfo is an array of objects with information about all novels on the site
  // Updates the whole novel db

  for (const novel of novelInfo) {
    const id = novel.id
    const title = novel.title
    const translator = novel.translator
    const numChapters = novel.numChapters
    const chapterInfo = novel.chapterInfo
    const author = novel.author
    const link = novel.link
    const revenue = novel.revenue // TODO: Create a new revenue and views entry for each novel to track data
    const views = novel.views
    let original = false

    if (author !== null && author == translator) {
      original = true
    }

    // Create records of Coins and Views so you can see your growth
    trackedRevenue = await new Coin({
      novelId: id,
      staff: translator,
      amount: revenue,
    }).save()

    trackedViews = await new View({
      novelId: id,
      amount: views,
    }).save()

    // Checks if there already is a novel in the db with the same name
    let dbNovel = await Novel.findOne({
      where: { novelId: id },
    })

    const translatorSnowflake = dbNovel?.translatorId || null
    const editorSnowflake = dbNovel?.editor || null

    for (const chpt of chapterInfo) {
      // Uploads all chapters into the DB unless they already exist
      let dbChap = Chapter.findOne({
        where: {
          chapterId: chpt.id,
          novelId: id,
        }
      })

      if (!dbChap) {
        // Chapter doesn't exist in the DB yet, so create it
        dbChap = await new Chapter({
          chapterId: chpt.id,
          novelId: id,
          title: chpt.name,
          translatorUsername: translator,
          translatorId: translatorSnowflake,
          editor: editorSnowflake,
          datePosted: new Date(),
          views: null,
        }).save()
      }
    }

    if (!dbNovel) {
      dbNovel = await new Novel({
        novelId: id,
        novelTitle: title,
        numChaptersReleased: numChapters,
        translatorUsername: translator,
        translatorId: null,
        editor: null,
        status: 'Ongoing',
        lastUpdated: new Date(),
        original: original,
        url: link,
      }).save()
    } else {
      if (numChapters !== dbNovel.numChaptersReleased) {
        // Checks if the number of chapters on the website is different from the number of chapters in the database
        const newChapters = numChapters - dbNovel.numChaptersReleased // The number of new chapters
        const role = dbNovel.role

        if (newChapters > 0) {
          notifyNewChapters(newChapters, title, link, role, client, newReleasesChannel) // ensure it is a positive increase in chapters
          await dbNovel.update({ // If the novel was previously marked as "dropped", then it will be set to "ongoing"
            status: 'Ongoing',
          })

          let dbTL = await User.findOne({ where: { discordSnowflake: dbNovel.translatorId } })
          let dbED = await User.findOne({ where: { discordSnowflake: dbNovel.editor } })

          if (dbTL) await dbTL.update({ hiatus: false, retired: false })
          if (dbED) await dbED.update({ hiatus: false, retired: false })
        }

        await dbNovel.update({
          numChaptersReleased: numChapters,
          lastUpdated: new Date(),
        })
      }

      dbNovel.update({
        novelTitle: title !== dbNovel.novelTitle ? title : dbNovel.novelTitle,
        translatorUsername: translator !== dbNovel.translatorUsername ? translator : dbNovel.translatorUsername,
        url: link !== dbNovel.url ? link : dbNovel.url,
        original: original !== dbNovel.original ? original : dbNovel.original,
      })
    }
  }

  await syncStaffNovelDB(client)
}
