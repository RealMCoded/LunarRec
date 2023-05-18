const { LogType, log } = require("./logger.js")

const db = process.db.users

async function loadSettings(uid){
    let userdata  = await db.findOne({ where: {id: uid} })

    return userdata.settings
}

async function setSetting(uid, req) {
    let json = await require("./decodeRequest.js").decodeRequest(req)
    json = JSON.parse(json)
    if (json == "") return;
    let userdata  = await db.findOne({ where: {id: uid} })
    let currentSettings = JSON.parse(userdata.settings)
    for(const element of currentSettings){
        if (element.Key == json.Key){
            log(LogType.API, `User ${uid}: Updated setting "${json.Key}" to "${json.Value}". Was "${element.Value}"`)
            element.Value = json.Value
        }
    }

    //Save settings to Player config
    await userdata.update({ settings: JSON.stringify(currentSettings) })
}

module.exports = { loadSettings, setSetting }