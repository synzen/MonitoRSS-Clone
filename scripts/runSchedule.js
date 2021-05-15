const fs = require('fs')
const path = require('path')
const configPath = path.join(__dirname, '..', 'settings', 'config.bot.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}
const { scripts, DeliveryPipeline } = require('monitorss')
const { RESTProducer } = require('@synzen/discord-rest')

const {
    apis: {
        discordHttpGateway: {
        redisUri: serviceRedisUri
        }
    }
} = config

const producer = new RESTProducer(serviceRedisUri)
const deliveryPipeline = new DeliveryPipeline(null, producer)

scripts.runSchedule(config).then((scheduleManager) => {
    scheduleManager.on('newArticle', newArticle => {
        deliveryPipeline.deliver(newArticle, null, true).catch((err) => {
            console.error(`Failed to deliver article ${JSON.stringify(newArticle)}`, err)
        })
    })
})

  