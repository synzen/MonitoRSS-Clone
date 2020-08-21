const fs = require('fs')
const path = require('path')
const MonitoRSSWeb = require('monitorss-web')
const configPath = path.join(__dirname, 'settings', 'config.web.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}

const webClientManager = new MonitoRSSWeb.WebClientManager(config)

webClientManager.start()
