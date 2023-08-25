const { LogType, log, log_raw } = require("./logger.js")
const WebSocket = require('ws');

const db = process.db.users

const ResponseResults = {
    RelationshipChanged: 1,
    MessageReceived: 2,
    MessageDeleted: 3,
    PresenceHeartbeatResponse: 4,
    SubscriptionListUpdated: 9,
    SubscriptionUpdateProfile: 11,
    SubscriptionUpdatePresence: 12,
    SubscriptionUpdateGameSession: 13,
    SubscriptionUpdateRoom: 15,
    ModerationQuitGame: 20,
    ModerationUpdateRequired: 21,
    ModerationKick: 22,
    ModerationKickAttemptFailed: 23,
    ServerMaintenance: 25,
    GiftPackageReceived: 30,
    ProfileJuniorStatusUpdate: 40,
    RelationshipsInvalid: 50,
    StorefrontBalanceAdd: 60,
    ConsumableMappingAdded: 70,
    ConsumableMappingRemoved: 71,
    PlayerEventCreated: 80,
    PlayerEventUpdated: 81,
    PlayerEventDeleted: 82,
    PlayerEventResponseChanged: 83,
    PlayerEventResponseDeleted: 84,
    PlayerEventStateChanged: 85,
    ChatMessageReceived: 90
};

function serve(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws) => {
        log(LogType.Debug, "WS: A client connected!")

        ws.on('message', async (data) => {
            ws.send(await processRequest(data));
        });

        ws.on('close', async (ws) => {
            log(LogType.Debug, "WS: A client disconnected!")
        });
    });
}

async function processRequest(data) {
    let res;
    
    log(LogType.WS, `Data received: ${data}`)

    data = JSON.parse(data);

    if (data.api != undefined) {
        if (data.api === "playerSubscriptions/v1/update") {
            log(LogType.WS, `Presence update called!`)
            res = await createResponse(12, data)
        } else if (data.api === "heartbeat2") {
            log(LogType.WS, `Heartbeat called!`)
            res = await createResponse(4, data)
        } else {
            log(LogType.WS, `Unknown call: "${data.api}". Sending blank response`)
            res = ""
        }
    } else {
        res = JSON.stringify({"SessionId": 2017})
    }

    log(LogType.WS, `Data sent: ${res}`)
    return res;
}

async function createResponse(id, data) {
    let usr = await db.findOne({ where: { id: data.param.PlayerIds[0] }})
    let ses = JSON.parse(usr.session)
    return JSON.stringify({
        Id: id,
        Msg: {
            PlayerId: data.param.PlayerIds[0],
            IsOnline: true,
            InScreenMode: false,
            GameSession: ses
        }
    })
}

module.exports = { serve }