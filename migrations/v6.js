const fs = require('fs')
const path = require('path')
const MonitoRSS = require('monitorss')
const configPath = path.join(__dirname, '..', 'settings', 'config.bot.json')
const configFile = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}

// This will potentially throw
MonitoRSS.config.set(configFile)

const config = MonitoRSS.config.get()
const v6 = MonitoRSS.migrations.v6

v6(config)
  .then((failures) => {
    console.log('Finished v6 migration')
    if (failures.length === 0) {
      return
    }
    for (const item of failures) {
      console.log(item.error)
      console.log(JSON.stringify(item.data, null, 2))
    }
    fs.writeFileSync(`./migrations/failures.log`, JSON.stringify(failures, null, 2))
    console.error('\n\n\x1b[31mThere were some migration failures. See output above, or failures.log in the migrations directory.\x1b[0m\n')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
