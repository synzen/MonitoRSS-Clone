
const config = require('../settings/config.bot.json')
const MonitoRSS = require('monitorss')
const { RESTProducer } = require('@synzen/discord-rest')

const {
    scripts,
    DeliveryPipeline,
    config: monitoRssConfig,
    errors,
    Feed
} = MonitoRSS

const {
    apis: {
        discordHttpGateway: {
        redisUri: serviceRedisUri
        }
    }
} = config

const {
    BadRequestError
} = errors

const producer = new RESTProducer(serviceRedisUri)
const deliveryPipeline = new DeliveryPipeline(null, producer)

async function main() {
    await MonitoRSS.setupModels(config.database.uri)
    monitoRssConfig.set(config)



    scripts.runSchedule(config).then((scheduleManager) => {
        scheduleManager.on('newArticle', newArticle => {
            const {
                feedObject,
                article
            } = newArticle
            deliveryPipeline.deliver(newArticle, null, true).catch((err) => {
                console.error(`Failed to deliver article for feed ${feedObject._id}`, err)
                if (err instanceof BadRequestError) {
                    disableFeed(err.feedId, article.link)
                }
            })
        })
        
        scheduleManager.on('alert', (channelId, message) => {
            sendMessageToChannel(channelId, message)
        })
    })
}

async function disableFeed(feedId, articleLink) {
    try {
        const feed = await Feed.get(feedId)
        if (!feed) {
            console.warn(`Unable to disable feed ${feedId} since it doesn't exist`)
            return
        }
        await feed.disable(Feed.DISABLE_REASONS.BAD_FORMAT)
        await sendMessageToChannel(feed.channel, `Failed to deliver article <${articleLink || 'no link available'}> for feed <${feed.url}>. The feed has now been disabled due to either bad text or bad embed. Update the text and/or embed, then test for validity to re-enable.`)
    } catch (err) {
        console.warn(`Failed to disable feed ${feedId}`, err)
    }
}

async function sendMessageToChannel(channelId, content) {
    try {
        await producer.enqueue(`https://discord.com/api/channels/${channelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                content
            })
        })
    } catch (err) {
        console.error(`Failed to send alert to channel ${channelId}`, err)
    }
}

main().catch(err => {
    console.error(err)
    process.exit()
})