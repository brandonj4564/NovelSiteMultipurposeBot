const db = require('../../libs/database')
const models = require('../../libs/database/models')

module.exports = async (client) => {
  console.log('Connecting to DB!')

  Object.keys(models).forEach((e) => {
    models[e].associate(models)
  })

  await db.sync({ force: process.env.FORCE_DB_RESET === 'true' })

  console.log('Connected to DB successfully!')

  console.log(`Logged in as ${client.user.tag}!`)
}
