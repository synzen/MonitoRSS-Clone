const fs = require('fs')
const path = require('path')
const configPath = path.join(__dirname, '..', 'settings', 'config.bot.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}

const { scripts, FeedFetcher } = require('discord.rss')

scripts.runSchedule(config, (err, scheduleRun) => {
  if (err) {
    throw err
  }
  const failedURLs = scheduleRun.failedURLs
  let done = 0
  const falsePositives = []
  console.log('Failed URLs', scheduleRun.failedURLs)
  console.log('Checking for false positives...')
  for (const url of failedURLs) {
    FeedFetcher.fetchFeed(url)
      .then(() => {
        falsePositives.push(url)
      })
      .catch(err => {})
      .finally(() => {
        if (++done === failedURLs.size) {
          console.log(`Done checking URLs, false positives (${falsePositives.length}):`, falsePositives)
        }
      })
  }
})

