const DiscordRSS = require('discord.rss')
const config = require('../settings/config.json')

// This will potentially throw
DiscordRSS.validateConfig(config)

const v6 = DiscordRSS.migrations.v6

v6(config)
  .then(() => {
    console.log('Finished v6 migration')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })


