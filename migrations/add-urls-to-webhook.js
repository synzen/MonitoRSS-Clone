const MonitoRSS = require('monitorss')
const config = require('../settings/config.bot.json')
const { RESTProducer } = require('@synzen/discord-rest')

const { Feed } = MonitoRSS
const producer = new RESTProducer(config.apis.discordHttpGateway.redisUri)

async function myfunc() {
    await MonitoRSS.setupModels(config.database.uri)
    const feeds = await Feed.getManyByQuery({
        "webhook.url": {$exists: false},
        "webhook.id": {$exists: true},
        $or: 
            [
                {
                    "webhook.disabled": null
                },
                {
                    "webhook.disabled": { $exists: false }
                },
                {
                    "webhook.disabled": false
                }
            ]
    })
    console.log(feeds.length)
    const webhooksById = new Map()
    const channelIds = Array.from(new Set(feeds.map((feed) => feed.channel)))
    // Get all the channel webhooks
    await Promise.all(channelIds.map(async (id) => {
        const { status, body } = await producer.fetch(`https://discord.com/api/channels/${id}/webhooks`)
        if (status !== 200) {
            throw new Error('bad status')
        }
        body.forEach((webhook) => {
            webhooksById.set(webhook.id, `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`)
        })
        return body
    }))
    // Attach urls to them
    await Promise.all(feeds.map(async (feed) => {
        const url = webhooksById.get(feed.webhook.id)
        if (!url) {
            throw new Error('missing webhook url')
        }
        feed.webhook = {
            ...feed.webhook,
            url
        }
        await feed.save()
    }))
    console.log('done')
    // Do what you want with Feed now
}

myfunc().then(process.exit).catch(console.error)