const chalk = require('chalk')
const { ports } = require("../config.json")
const { WebSocketServer } = require('ws');
const db = process.db.users

let port;

port = ports.WS

async function start(){
    try {
        serve()
    } catch(e) {
        console.error(e)
    }
}

async function serve() {
    const wss = new WebSocketServer({ port: port });

    wss.on('connection', async (ws) => {
        console.log(`${chalk.blueBright("[WS]")} Client connected!`);
        ws.on('message', async (data) => {
            console.log(`${chalk.blueBright("[WS]")} Data received: ${data}`);
            let thing = await processRequest(data)
            console.log(`${chalk.blueBright("[WS]")} Data sent: ${thing}`)
            ws.send(thing)
        });

        ws.on('close', async () => {
            console.log(`${chalk.blueBright("[WS]")} Client disconnected.`);
        });
    });

    console.log(`${chalk.blueBright("[WS]")} WS started on port ${port}`)
}

async function processRequest(data){
    let result;

    data = JSON.parse(data)

    if (data.api != undefined) {
        if (data.api == "playerSubscriptions/v1/update"){
            console.log(`${chalk.blueBright("[WS]")} Presence update called!`)
            var usr = db.findOne({ where: { id: data.param.PlayerIds[0] }})
            var ses = usr.session
            return JSON.stringify({
                Id: 12, 
                Msg: {
                    PlayerId: data.param.PlayerIds[0],
                    IsOnline: true,
                    InScreenMode: false,
                    GameSession: ses
                }
            });
        }else if (data.api == "heartbeat2"){
            result = JSON.stringify(data)
        } else {
            result = ""
        }
    } else {
        result = JSON.stringify({"SessionId": 2017})
    }

    return result;
}

module.exports = { start }