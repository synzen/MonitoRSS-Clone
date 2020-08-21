const fs = require('fs')
const path = require('path')
const MonitoRSS = require('monitorss')
const schedulesPath = path.join(__dirname, 'settings', 'schedules.json')
const configPath = path.join(__dirname, 'settings', 'config.bot.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}
const schedules = fs.existsSync(schedulesPath) ? JSON.parse(fs.readFileSync(schedulesPath)) : {}

const clientManager = new MonitoRSS.ClientManager({
  setPresence: true,
  schedules,
  config
})

clientManager.start()
