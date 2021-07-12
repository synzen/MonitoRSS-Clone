// @ts-check
const config = require('../settings/config.bot.json')
const MonitoRSS = require('monitorss')
const { RESTProducer } = require('@synzen/discord-rest')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const schedulesPath = path.join(__dirname, '..', 'settings', 'schedules.json')
const customSchedules = fs.existsSync(schedulesPath) ? JSON.parse(fs.readFileSync(schedulesPath)) : []

const {
    scripts,
    DeliveryPipeline,
    config: monitoRssConfig,
    errors,
    Feed,
    Profile
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

monitoRssConfig.set(config)

const producer = new RESTProducer(serviceRedisUri)
const deliveryPipeline = new DeliveryPipeline(null, producer)

async function main() {
    await MonitoRSS.setupModels(config.database.uri)

    scripts.runSchedule(config, {
        schedules: customSchedules
    }).then((scheduleManager) => {
        scheduleManager.on('newArticle', newArticle => {
            const {
                feedObject,
                article
            } = newArticle
            deliveryPipeline.deliver(newArticle, null, true).catch((err) => {
                if (err instanceof BadRequestError) {
                    disableFeed(err.feedId, article.link)
                }
            })
        })
        
        scheduleManager.on('alert', async (channelId, message) => {
            try {
                const channel = await fetchChannel(channelId)
                await sendAlert(channel.guild_id, channelId, message)
            } catch (err) {
                console.error(`Failed to send alert for channel ${channelId}`, err)
            }
        })
    })
}

async function disableFeed(feedId, articleLink) {
    try {
        const feed = await Feed.get(feedId)
        if (feed.disabled) {
            return
        }
        console.log(`Disabling feed ${feedId} due to bad format`)
        if (!feed) {
            console.warn(`Unable to disable feed ${feedId} since it doesn't exist`)
            return
        }
        await feed.disable(Feed.DISABLE_REASONS.BAD_FORMAT)
        /**
         * @type {import('monitorss').Profile|null}
         */
        const errorMessage = `Failed to deliver article <${articleLink || 'no link available'}> for feed <${feed.url}>. The feed has now been disabled due to either bad text or bad embed. Update the text and/or embed, then test for validity to re-enable.`
        await sendAlert(feed.guild, feed.channel, errorMessage)
    } catch (err) {
        console.warn(`Failed to disable feed ${feedId}`, err)
    }
}

async function fetchChannel(channelId) {
    const res = await producer.fetch(`https://discord.com/api/channels/${channelId}`, {
        method: 'GET'
    })
    return res.body
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

/**
 * 
 * @param {string} guildId
 * @param {string} channelId
 * @param {string} errorMessage 
 * @returns 
 */
async function sendAlert(guildId, channelId, errorMessage) {
    const userAlerts = await getUserAlerts(guildId)
    if (!userAlerts) {
        return await sendMessageToChannel(channelId, errorMessage)
    }
    await Promise.all(userAlerts.map((id) => sendMessageToUser(id, errorMessage)))
}

async function sendMessageToUser(userId, content) {
    try {
        const {status, body} = await producer.fetch(`https://discord.com/api/users/@me/channels`, {
            method: 'POST',
            body: JSON.stringify({
                recipient_id: userId
            })
        })
        assert.strictEqual(status, 200, `Bad status code fetching DM channel for ${userId}`)
        const channelId = body.id
        const {status: sendStatus} = await producer.fetch(`https://discord.com/api/channels/${channelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                content
            })
        })
        assert.strictEqual(sendStatus, 200, `Bad status code when sending message for ${userId}`)
    } catch (err) {
        console.error(`Failed to send alert to user ${userId}`, err)
    }
}

async function getUserAlerts(guildId) {
    /**
     * @type {import('monitorss').Profile|null}
     */
    const profile = await Profile.get(guildId)
    if (!profile || !profile.alert || !profile.alert.length) {
        return null
    }
    return profile.alert
}

main().catch(err => {
    console.error(err)
    process.exit()
})