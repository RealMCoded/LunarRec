const fetch = require("node-fetch")
const { webhook } = require("./config.json")

async function sendWebhook(data){
    if (webhook == null || webhook == "") return;
    await fetch(webhook,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: data})
    });
}

module.exports = { sendWebhook }