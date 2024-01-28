const { User, Coin, Chapter, View } = require('../../libs/database/models')
const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')
const updateNovelDatabase = require('../../libs/database/updateNovelDatabase')
const webScraperHandler = require('../../handlers/webScraperHandler')
const cheerio = require('cheerio')
const superagent = require('superagent').agent()

module.exports = {
  name: 'scan',
  description: 'Scans the Luminary Novels website and gets data on all novels.',
  devOnly: true,
  testOnly: true,
  deleted: false,

  /**
   * This gives me information about my parameters in VSCode
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply()

    // const novelInfo = await getSpecificNovelInformation("https://luminarynovels.com/wp-admin/post.php?post=1733&action=edit")

    const revenue = await Chapter.findAll()
    console.log(revenue)
    interaction.editReply('hi')
  },
}

async function getSpecificNovelInformation(url) {
  const novel = await superagent.get(url)
  const $ = cheerio.load(novel.text)

  const name = $('#titlewrap').find('input').attr('value')
  // const description = $('div.wp-editor-container').text()
  const chapters = $('a.wp-manga-edit-chapter')
  let chapterInfo = []
  for (const chap of chapters) {
    chapterInfo.push({
      id: parseInt(chap.attribs['data-chapter']),
      name: chap.children[0].data
    })
  }
  const numChapters = chapters.length
  const permalink = $('div.hide-if-no-js').find('#sample-permalink').find('a').attr('href')

  return {
    title: name,
    // description: description,
    chapters: chapterInfo,
    numChapters: numChapters,
    link: permalink,
  }
}

async function getNovelViews(url) {
  const novelPage = await superagent.get(url)
  const $ = cheerio.load(novelPage.text)

  let views = "0"

  const viewsTable = $('div.stats-card--body').find('ul.horizontal-bar-list').text()
  console.log(viewsTable)
  for (entry of viewsTable) {
    console.log(entry)
  }

  return views
}

async function getNovelRevenue(url) {
  const coinReport = await superagent.get(url)
  const $ = cheerio.load(coinReport.text)

  let revenueInfo = {}

  const title = $('td.column-title').find('a')
  const coins = $('td.column-coins')

  let i = 0; // There must be a better way of doing this but at least it works, right?
  for (const ti of title) {
    const specificTitle = ti.children[0].data
    const rev = coins[`${i}`].children[0].data

    // Use square brackets to set the property dynamically using the value of specificTitle
    revenueInfo[specificTitle] = parseInt(rev)
    i++
  }

  const nextPage = $('a.next-page').attr()?.href || false
  if (nextPage) {
    const nextPageRevInfo = await getNovelRevenue(nextPage)
    Object.assign(revenueInfo, nextPageRevInfo)
  }

  // The novel title "Shattered" doesn't show up as a string in the revenueInfo object for some reason, I hope it's fine

  return revenueInfo
}