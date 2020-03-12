// Create a single client

const DiscordRSS = require('discord.rss')
const drss = new DiscordRSS.Client()

drss.login(process.env.DRSS_BOT_TOKEN)
