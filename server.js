if (process.env.DRSS_START === 'bot-web') {
  require('./bot-web.js')
} else if (process.env.DRSS_START === 'web') {
  require('./web.js')
} else {
  require('./bot.js')
}
