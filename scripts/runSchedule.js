const fs = require('fs')
const path = require('path')
const configPath = path.join(__dirname, '..', 'settings', 'config.bot.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}
const { scripts, FeedFetcher } = require('discord.rss')

const stayAlive = setTimeout(() => {}, 1 << 30)

/**
 * @param {string[]} urls 
 */
async function checkFalsePositives (urls) {
  console.log(`Failed URLs (${urls.length})`, urls)
  try {
    const results = await Promise.allSettled(urls.map(url => FeedFetcher.fetchFeed(url)))
    const fp = []
    for (let i = 0; i < urls.length; ++i) {
      const url = urls[i]
      const result = results[i]
      if (result.status === 'fulfilled') {
        fp.push(url)
      }
    }
    console.log(`Done checking URLs, false positives (${fp.length}):`, fp)
    clearInterval(stayAlive)
  } catch (err) {
    console.error(err)
  }
}

scripts.runSchedule(config)
  .then((scheduleRun) => {
    scheduleRun.on('finish', () => {
      checkFalsePositives(Array.from(scheduleRun.failedURLs))
    })
  })
  .catch(console.error)
