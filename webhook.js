const fetch = require("node-fetch")
const { webhook } = require("./config.json")

async function sendWebhook(data){
    if (webhook.console == null || webhook.console == "") return;
    await fetch(webhook.console,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: data})
    });
}

async function sendReport(data){
    if (webhook.reports == null || webhook.reports == "") return;
    await fetch(webhook,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: data})
    });
}

module.exports = { sendWebhook }