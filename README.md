# MonitoRSS Clone (Formerly Discord.RSS)

**This repository is only for users who will clone MonitoRSS (formerly known as Discord.RSS) files directly.**

The main repository is located at https://github.com/synzen/MonitoRSS, and the web repository at https://github.com/synzen/MonitoRSS-Web.

***

Driven by the lack of comprehensive RSS bots available, I have decided to try my hand at creating one of my own. Designed with as much customization as possible for both users and bot hosters, while also (or should be) easy to understand.

All documentation can be found at https://docs.monitorss.xyz/.

### Publicly Hosted Instance

Don't want to bother hosting your own instance? Use the publicly hosted one!

https://discordapp.com/oauth2/authorize?client_id=268478587651358721&scope=bot&permissions=19456


### Web Interface

MonitoRSS also comes with a web interface! To run the web interface, see the documentation.

![UI Screenshot](https://i.imgur.com/CD8mbRh.png)

### Deploy to Heroku

You can deploy the bot in a simple way to Heroku using the button below. [Click here for detailed instructions](https://github.com/synzen/MonitoRSS/issues/45) - **you must have MongoDB hosted with its URI ready to also insert into `DRSS_DATABASE_URI` environment variable**.

<!-- [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) -->

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https://github.com/synzen/MonitoRSS-Clone&template=https://github.com/synzen/MonitoRSS-Clone/tree/master)

*If you want to deploy manually without the button, you can [follow this guide instead](https://github.com/synzen/MonitoRSS/issues/95).*

### Hosting on Glitch

MonitoRSS requires node.js v12.16. As of 23 May 2020, Glitch does not install v12.16 automatically, and must be manually installed. For MonitoRSS to work on Glitch, follow these steps.

#### Setup

1. Click the remix button and wait for the setup to complete. Be sure to make your project private to protect your configs.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/synzen/MonitoRSS-Clone)

2. Open terminal and run the following command. Adding the git remote will let you pull updates from the clone repo.
```
git remote add origin https://github.com/synzen/MonitoRSS-Clone.git && npm install --no-save node@12.16.3
```

3. Set up your [configs](https://docs.monitorss.xyz/configuration/bot-configuration). You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the MongoDB database and [Redis Labs](https://redislabs.com/) for the Redis database.
4. Use a tool like [Uptime Robot](https://uptimerobot.com/) to prevent the bot from going offline.

If you want the web interface, you will need to follow the [web configuration](https://docs.monitorss.xyz/configuration/web-interface) and add the following in a file named .env:

![image](https://user-images.githubusercontent.com/44692189/82736173-5b68f500-9d49-11ea-9e42-9b23af184438.png)

The web port for Glitch is 3000.

#### Updating

See https://docs.monitorss.xyz/setting-up/staying-updated. Since using `npm install` will remove the required node v12.16 automatically, you must install it again after updating:

```
git reset --hard origin/master && npm install && npm install --no-save node@12.16.3
```


