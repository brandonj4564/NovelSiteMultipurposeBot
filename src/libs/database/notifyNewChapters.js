const { Novel } = require('./models')
const cheerio = require('cheerio')
const superagent = require('superagent').agent()
const { EmbedBuilder } = require('discord.js')

module.exports = async (newChapters, title, link, role, client) => {
  try {
    // Function to scan for the new releases for a novel and then ping the role associated with that novel
    const channel = await client.channels.cache.get(process.env.NEW_RELEASES_CHANNEL) // gets the new releases channel
    const novel = await superagent.get(link)
    let $ = cheerio.load(novel.text)

    if (!role) {
      // The novel has no associated role, so I guess I'll just send a general message in the new releases channel
      channel.send(`New chapters are available for ${title}!\nRead them at ${link}.`)
    } else {
      channel.send(`<@&${role}>\nNew chapters are available for ${title}!\nRead them at ${link}.`)
    }
  } catch (error) {
    console.log(error)
  }
}

// READ: I initially intended to have a message for every new chapter release, but I can't access the actual chapter links so that went down the drain
// const sendNewChapterMessage = async (newChapters, role, channel) => {
//   const remainingNewChapters = newChapters - 1
//   if (remainingNewChapters > 0) {
//     await sendNewChapterMessage(remainingNewChapters, role, channel)
//   }

//   if (!role) {
//     // The novel has no associated role, so I guess I'll just send a general message in the new releases channel
//     channel.send(``)
//   }
// }
