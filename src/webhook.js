const fetch = require("node-fetch")
const { webhook, serverAddress } = require("../config.json")

/***
 * Enum for webhookMessage()
 * @readonly
 * @enum {number}
 */
const dataType = {
    StartUp: 0,
    PlayerOnline: 1,
    PlayerOffine: 2,
    AccountCreate: 3,
    ActivityChange: 4
}

async function webhookMessage(type, data){
    if (webhook.console == null || webhook.console == "") return;

    let embedData = {
      color: 0,
      title: "Title",
      description: "Description",
      icon: "https://raw.githubusercontent.com/RealMCoded/LunarRec/master/cdn/profileImages/__default.png"
    }

    switch(type) {
      case dataType.StartUp: {
        embedData.color = 35890
        embedData.title = "This LunarRec instance has started!"
        embedData.description = null
      } break;
      case dataType.PlayerOnline: {
        embedData.color = 35890
        embedData.title = "Player online!"
        embedData.description = `**${data.username}** is now online!`
        embedData.icon = `${serverAddress}/img/${data.id}`
      } break;
      case dataType.PlayerOffine: {
        embedData.color = 16526123
        embedData.title = "Player offline."
        embedData.description = `**${data.username}** is now offline.`
        embedData.icon = `${serverAddress}/img/${data.id}`
      } break;
      case dataType.AccountCreate: {
        embedData.color = 35890
        embedData.title = "Account created!"
        embedData.description = `Welcome "**${data.username}**" to LunarRec!`
        //embedData.icon = `${serverAddress}/img/${data.id}`
      } break;
      default: {
        embedData.color = 0
        embedData.title = `Invalid Data Type provided: \`${type}\``
        embedData.description = `Data provided: \`${data}\``
      } break;
    }

    sendWebhook(embedData)
}

/***
 * Enum for sendReport()
 * @readonly
 * @enum {number}
 */
const reportType = {
    General: 0,
    Immature: 1,
    Cheating: 2,
    Harassment: 3,
    Other: -1
}

async function sendReport(type, data){
    if (webhook.reports == null || webhook.reports == "") return;
    await fetch(webhook,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: data})
    });
}

async function sendWebhook(embedData) {
  await fetch(webhook.console,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        allowed_mentions: {parse: [],},
        embeds: [{
          color: embedData.color,
          title: embedData.title,
          description: embedData.description,
          thumbnail: {
            url: embedData.icon,
          },
          footer: {
            text: 'LunarRec',
            icon_url: 'https://raw.githubusercontent.com/RealMCoded/LunarRec/master/cdn/profileImages/__default.png',
          },
          timestamp: new Date()
        }]
      }),
    }
  );
}

module.exports = { dataType, webhookMessage }