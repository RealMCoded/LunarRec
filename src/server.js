const chalk = require('chalk')
const express = require('express') //express.js - the web server
const morgan = require('morgan') //for webserver output
const app = express()
const path = require("path")
const fs = require("fs")
app.use(morgan(`${chalk.green("[API]")} :method ":url" :status - :response-time ms`))

const { targetVersion, ports, serverAddress } = require("../config.json")

let port, uid;

uid = 0

port = ports.API

async function start() {
    try {
        serve()
    } catch(e){
        console.log(e)
    }
}

async function serve() {
    app.use((req, res, next) => {
        //console.log(req.headers)
        var head = req.headers;
        try {
            uid = head.authorization.slice(7)
            console.log(uid)
        } catch(e) {

        }
        //head = head.slice(7)
        next()
    })

    //Return some server stats when pinging just the IP
    app.get('/', (req, res) => {
        res.send("<p>✅ This LunarRec instance is running!<br><br>Ping: <b>PLACEHOLDER</b><br><br>There are <b>PLACEHOLDER</b> users registered and <b>PLACEHOLDER</b> users online.</p>")
    })

    app.get('/api/stats', (req, res) => {
        res.send(JSON.stringify({
            name: "LunarRec",
            description: "LunarRec Server",
            targetVersion: targetVersion,
            ping: 0,
            users:{
                registered:0,
                online:0
            }
        }))
    })

    /**
     * GET REQUESTS
     */

    app.get('/api/versioncheck/*', (req, res) => {
        let rrversion = req.headers['x-rec-room-version']
        //console.log(rrversion)
        if(targetVersion != null) {
            if (rrversion == targetVersion){
                res.send("{\"ValidVersion\":true}")
            } else {
                res.sendStatus(404)
            }
        } else {
            res.send("{\"ValidVersion\":true}")
        }
    })

    app.get(`/api/players/v1/*`, async (req, res) => {
        let body = await require("./datamanager.js").getProfile(uid)
        body = JSON.parse(body)
        res.send(JSON.stringify(body))
    })

    app.get(`/api/players/v1/blockduration`, async (req, res) => {
        res.send("[]")
    })

    app.get(`/api/gamesessions/v1/*`, async (req, res) => {
        res.send("[]")
    })

    app.get(`/api/players/v1/phonelastfour`, async (req, res) => {
        res.send("2419")
    })

    app.get(`/api/players/v1/search/*`, async (req, res) => {
        res.sendStatus(404)
    })

    app.get(`/api/avatar/v2`, async (req, res) => {
        let body = await require("./avatar.js").loadAvatar(uid)
        res.send(body)
    })

    app.get(`/api/avatar/v3/items`, async (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/../shared-items/avataritems.txt`))
    })

    app.get(`/api/settings/v2`, async (req, res) => {
        let body = await require("./settings.js").loadSettings(uid)
        res.send(body)
    })

    app.get('/api/equipment/v1/getUnlocked', (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/../shared-items/equipment.txt`))
    })

    app.get('/api/activities/charades/v1/words', (req, res) => {
        res.send(require("./charades.js").generateCharades())
    })

    app.get('/api/avatar/v2/gifts', (req, res) => {
        res.send("[]")
    })

    app.get('/api/relationships/v2/get', (req, res) => {
        res.send("[]")
    })

    app.get('/api/messages/v2/get', (req, res) => {
        res.send("[]")
    })

    app.get('/api/PlayerReporting/v1/moderationBlockDetails', (req, res) => {
        res.send(JSON.stringify({"ReportCategory":0,"Duration":0,"GameSessionId":0,"Message":""}))
    })

    app.get('/api/config/v2', (req, res) => {
        res.send(JSON.stringify({
            MessageOfTheDay: fs.readFileSync("./motd.txt", 'utf8'),
            CdnBaseUri: `${serverAddress}:${ports.IMG}/`,
            LevelProgressionMaps:[{"Level":0,"RequiredXp":1},{"Level":1,"RequiredXp":2},{"Level":2,"RequiredXp":3},{"Level":3,"RequiredXp":4},{"Level":4,"RequiredXp":5},{"Level":5,"RequiredXp":6},{"Level":6,"RequiredXp":7},{"Level":7,"RequiredXp":8},{"Level":8,"RequiredXp":9},{"Level":9,"RequiredXp":10},{"Level":10,"RequiredXp":11},{"Level":11,"RequiredXp":12},{"Level":12,"RequiredXp":13},{"Level":13,"RequiredXp":14},{"Level":14,"RequiredXp":15},{"Level":15,"RequiredXp":16},{"Level":16,"RequiredXp":17},{"Level":17,"RequiredXp":18},{"Level":18,"RequiredXp":19},{"Level":19,"RequiredXp":20},{"Level":20,"RequiredXp":21}],
            MatchmakingParams:{
                PreferFullRoomsFrequency: 1,
                PreferEmptyRoomsFrequency: 0
            },
            DailyObjectives: [[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}],[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}],[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}],[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}],[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}],[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}],[{"type":20,"score":1},{"type":21,"score":1},{"type":22,"score":1}]],
            ConfigTable: [{"Key":"Gift.DropChance","Value":"0.5"},{"Key":"Gift.XP","Value":"0.5"}],
            PhotonConfig: {"CloudRegion":"us","CrcCheckEnabled":false,"EnableServerTracingAfterDisconnect":false}
        }))
    })

    /**
     * POST REQUESTS
     */

    app.post('*/api/platformlogin/v*/profiles', async (req, res) => {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            body = body.slice(32) //this is the user's Steam ID
            body = await require("./datamanager.js").getProfile(body)
            body = JSON.parse(body)
            res.send(JSON.stringify([body]))
        })
    })

    app.post('*/api/platformlogin/v*/', async (req, res) => {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            body = body.slice(32).slice(0,7) //this is the user's Steam ID
            console.log(body)
            res.send(JSON.stringify({Token: body.toString(), PlayerId:body, Error: ""}))
        })
    })

    app.post('/api/images/v*/profile', async (req, res) => {
        await require("./image.js").setPFP(uid, req)
        res.sendStatus(200);
    })

    app.post(`/api/settings/v2/set`, async (req, res) => {
        await require("./settings.js").setSetting(uid, req)
        res.send("[]")
    })

    app.post(`/api/players/v2/displayname`, async (req, res) => {
        let newname = await require("./datamanager.js").setName(uid, req)
        res.send(JSON.stringify({Success: true, Message: `Name changed to "${newname}"!`}))
    })

    app.post(`/api/avatar/v2/set`, async (req, res) => {
        await require("./avatar.js").saveAvatar(uid, req)
        res.send("[]")
    })

    app.listen(port, () => {
        console.log(`${chalk.green("[API]")} API started on port ${port}`)
    })
}

module.exports = { start }