const cheerio = require('cheerio')
const superagent = require('superagent').agent()

// async function run() {
//   const url = 'https://luminarynovels.com/wp-login.php'
//   const dashboard = await superagent
//     .post(url)
//     .send({ log: process.env.LUMINARY_USERNAME, pwd: process.env.LUMINARY_PASSWORD })
//     .set('Content-Type', 'application/x-www-form-urlencoded')

//   return await accessAllNovelInfo(
//     'https://luminarynovels.com/wp-admin/edit.php?post_status=publish&post_type=wp-manga&paged=1'
//   )
// }

async function accessAllNovelInfo(url) {
  const allNovels = await superagent.get(url)
  const $ = cheerio.load(allNovels.text)

  let novelInfo = []

  const novelIds = $('td.id')
  const novelTitles = $('a.row-title')
  const translators = $('td.author')
  const authors = $('td.taxonomy-wp-manga-author')

  for (let i = 0; i < novelTitles.length; i++) {
    const link = novelTitles.get(i).attribs.href
    const specificNovelInfo = await getSpecificNovelInformation(link)
    let author = $(authors.get(i))?.text() || null
    if (author == '—No tags') {
      author = null
    }

    novelInfo.push({
      id: parseInt($(novelIds.get(i)).text()),
      title: specificNovelInfo.title,
      // description: specificNovelInfo.description,
      translator: $(translators.get(i)).text(),
      author: author,
      numChapters: specificNovelInfo.numChapters,
      link: specificNovelInfo.link,
    })
  }

  const nextPage = $('a.next-page').attr()?.href || false
  if (nextPage) {
    const nextPageNovelInfo = await accessAllNovelInfo(nextPage)
    novelInfo = novelInfo.concat(nextPageNovelInfo)
  }

  return novelInfo
}

async function getSpecificNovelInformation(url) {
  const novel = await superagent.get(url)
  const $ = cheerio.load(novel.text)

  const name = $('#titlewrap').find('input').attr('value')
  // const description = $('div.wp-editor-container').text()
  const numChapters = $('li.manga-single-volume').find('ul').find('li').length
  const permalink = $('div.hide-if-no-js').find('#sample-permalink').find('a').attr('href')

  return {
    title: name,
    // description: description,
    numChapters: numChapters,
    link: permalink,
  }
}

module.exports = {
  name: 'luminary',
  run: async () => {
    const url = 'https://luminarynovels.com/wp-login.php'
    const dashboard = await superagent
      .post(url)
      .send({ log: process.env.LUMINARY_USERNAME, pwd: process.env.LUMINARY_PASSWORD })
      .set('Content-Type', 'application/x-www-form-urlencoded')

    return await accessAllNovelInfo(
      'https://luminarynovels.com/wp-admin/edit.php?post_status=publish&post_type=wp-manga&paged=1'
    )
  },
}
