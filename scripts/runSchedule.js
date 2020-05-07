const fs = require('fs')
const path = require('path')
const configPath = path.join(__dirname, '..', 'settings', 'config.bot.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}

const runSchedule = require('discord.rss').scripts.runSchedule

runSchedule(config)
  .catch(console.error)

