const fs = require('fs')
const path = require('path')
const DiscordRSSWeb = require('discord.rss-web')
const configPath = path.join(__dirname, 'settings', 'config.web.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}

const webClientManager = new DiscordRSSWeb.WebClientManager(config)

webClientManager.start()
