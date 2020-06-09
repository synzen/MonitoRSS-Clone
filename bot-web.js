/**
 * Set the env variable to prevent race conditions where web
 * overwrites bot config
 */
process.env.DRSS_START = 'bot-web'
require('./bot.js')
require('./web.js')
