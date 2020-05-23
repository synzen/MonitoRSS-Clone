# Discord.RSS Clone

**This repository is only for users who will clone Discord.RSS files directly.**

The main repository is located at https://github.com/synzen/Discord.RSS, and the web repository at https://github.com/synzen/Discord.RSS-Web.

***

Driven by the lack of comprehensive RSS bots available, I have decided to try my hand at creating one of my own. Designed with as much customization as possible for both users and bot hosters, while also (or should be) easy to understand.

All documentation can be found at https://docs.discordrss.xyz/.

### Publicly Hosted Instance

Don't want to bother hosting your own instance? Use the publicly hosted one!

https://discordapp.com/oauth2/authorize?client_id=268478587651358721&scope=bot&permissions=19456


### Web Interface

Discord.RSS also comes with a web interface! To run the web interface, see the documentation.

![UI Screenshot](https://i.imgur.com/CD8mbRh.png)

### Deploy to Heroku

You can deploy the bot in a simple way to Heroku using the button below. [Click here for detailed instructions](https://github.com/synzen/Discord.RSS/issues/45).

<!-- [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) -->

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https://github.com/synzen/Discord.RSS-Clone&template=https://github.com/synzen/Discord.RSS-Clone/tree/master)

*If you want to deploy manually you can [follow this guide](https://github.com/synzen/Discord.RSS/issues/95).*

### Hosting on Glitch

Click the button below to import the code to Glitch. Wait for the importing process to complete, make your project private and fill in the [Configuration](https://docs.discordrss.xyz/configuration/bot-configuration). Use a tool like [Uptime Robot](https://uptimerobot.com/) to prevent the bot from going offline.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/synzen/Discord.RSS-Clone)

You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the MongoDB database and [Redis Labs](https://redislabs.com/) for the Redis database.

The web port for Glitch is 3000.

Discord.RSS requires node.js v12.16. As of 23 May 2020, Glitch currently does not install v12.16 automatically, and must be manually installed. For Discord.RSS to work on Glitch, you will need to modify the scripts section to manually install v12.16.

Include the following in a new line below `"scripts": {`:

```
"preinstall": "npm install --save node@12.16.3",
```

If you want the web UI, you will need to add the following in a file named .env:

```
DRSS_START=bot-web
```
