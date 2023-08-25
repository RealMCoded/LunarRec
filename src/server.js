const { targetVersion, port, serverAddress, instance_info, hostPage, logConnections, customPosters } = require("../config.json")
const db = process.db.users

const express = require('express') //express.js - the web server
const morgan = require('morgan') //for webserver output
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const app = express()
const path = require("path")
const fs = require("fs")
const { version } = require("../package.json")
const {getPlayerTotal, getOnlinePlayers, getPlayerArray} = require("./players.js")
const {token_signature} = require("../config.json")
const { LogType, log, log_raw } = require("./logger.js")
if (logConnections) app.use(morgan(log_raw(LogType.API, `:remote-addr :method ":url" :status - :response-time ms`)))

app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

let uid;

uid = 0

const authenticateToken = async (req, res, next) => {
    // Define an array of endpoints that do not require authorization
    const loginEndpoints = [
        /^\/$/,
        /^\/api\/versioncheck\//,
        /^\/api\/config\/v\d+$/,
        /^\/api\/platformlogin\/v\d+$/,
        /^\/api\/platformlogin\/v\d+\/profiles$/
    ];
    
    for (const endpointRegex of loginEndpoints) {
        if (endpointRegex.test(req.path)) {
            return next(); // Skip authentication for matched endpoints
        }
    }    
  
    // Rest of the authentication logic
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401); // Unauthorized
    }
  
    jwt.verify(token, token_signature, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      uid = decoded.PlayerId
      next();
    });
};

async function start() {
    try {
        serve()
    } catch(e){
        log(LogType.Error, e)
    }
}

async function serve() {
    app.use(authenticateToken);

    //Name Server
    app.get('/', async (req, res) => {
        res.send(JSON.stringify({NOTE: "LunarRec Name Server. If IPs are wrong check your config.", API:`${serverAddress}`, Notifications:`${serverAddress}`, Images:`${serverAddress}/img`}))
    })

    //Misc server info
    app.get('/api/stats', async (req, res) => {
        const start = Date.now();
        res.json({
            name: instance_info.name,
            description: instance_info.description,
            owner: instance_info.owner,
            website: instance_info.website,
            targetVersion: targetVersion,
            ping: undefined, //TODO: Calculate Ping
            users:{
                registered: await getPlayerTotal(),
                online: await getOnlinePlayers()
            },
            lunarrec_server_version:{
                version:version,
                commit:process.commit
            }
        })
    })

    /**
     * GET REQUESTS
     */

    app.get('/api/versioncheck/*', (req, res) => {
        let rrversion = req.headers['x-rec-room-version']
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

    app.get(`/api/players/v1/list`, async (req, res) => {
        res.send("[]")
    })

    app.get(`/api/players/v1/blockduration`, async (req, res) => {
        res.send("[]")
    })

    app.get(`/api/gamesessions/v1/*`, async (req, res) => {
        res.send("[]")
    })

    app.get(`/api/events/v*/list`, async (req, res) => {
        res.send("[]")
    })

    app.get(`/api/players/v1/phonelastfour`, async (req, res) => {
        res.send("2419")
    })

    app.get(`/api/players/v1/search/*`, async (req, res) => {
        res.sendStatus(404)
    })

    app.get('/api/config/v1/amplitude', (req, res) => {
        res.send(JSON.stringify({AmplitudeKey: "NoKeyProvided"}))
    })

    app.get('/api/PlayerReporting/v1/moderationBlockDetails', (req, res) => {
        res.send(JSON.stringify({"ReportCategory":0,"Duration":0,"GameSessionId":0,"Message":""}))
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

    app.get('/api/config/v2', (req, res) => {
        res.send(JSON.stringify({
            MessageOfTheDay: fs.readFileSync("./shared-items/motd.txt", 'utf8'),
            CdnBaseUri: `${serverAddress}`,
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

    app.get('/img/:id', (req, res) => {
        try {
            const id = req.params.id
            console.log(id)
            console.log(req.params.id.includes("IMG_"))
            let filedir;
            if (req.params.id.includes("IMG_")) filedir = `${__dirname}/../cdn/images/${id}`; else filedir = `${__dirname}/../cdn/profileImages/${id}.png`;
            if (fs.existsSync(filedir)) {
                res.sendFile(path.resolve(filedir))
            } else {
                res.sendStatus(404)
            }
        } catch(e) {
            res.sendStatus(500)
        }
    })

    
    app.get('/api/images/v1/named', (req, res) => {
        if (customPosters) {
            const filedir = `${__dirname}/../cdn/posters/${req.query.img}.png`
            if (fs.existsSync(filedir)) {
                res.sendFile(path.resolve(filedir))
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    })

    /**
     * POST REQUESTS
     */

    app.post(`/api/players/v1/getorcreate`, async (req, res) => {
        log(LogType.Error, "This version of Rec Room is not supported. (It's too old!)")
        res.sendStatus(404)
    })

    app.post('*/api/platformlogin/v*/profiles', async (req, res) => {
        body = req.body.PlatformId
        let accs = await require("./datamanager.js").getAssociatedAccounts(body)
        if (accs.length == 0) {
            let acc = await require("./datamanager.js").createAccount(`LunarRecUser_${await getPlayerTotal()+1}`, body)
            accs = [JSON.parse(acc)]
        }

        res.send(JSON.stringify([accs[0]]))
    })

    app.post('*/api/platformlogin/v*/', async (req, res) => {
        let body_JWT = req.body
        //remove any unused params to reduce bloat
        delete body_JWT.AuthParams
        delete body_JWT.BuildTimestamp
        delete body_JWT.DeviceId

        const token = jwt.sign(req.body, token_signature, {expiresIn: "24h"});
        res.send(JSON.stringify({Token: token, PlayerId:body_JWT.PlayerId, Error: ""}))
    })

    app.post('/api/images/v*/profile', async (req, res) => {
        await require("./image.js").setPFP(uid, req)
        res.sendStatus(200);
    })

    app.post('/api/images/v*/uploadtransient', async (req, res) => {
        var img = await require("./image.js").uploadImg(true, uid, req)
        res.send(img)
    })

    app.post('/api/images/v*/deletetransient', async (req, res) => {
        await require("./image.js").deleteImg(req)
        res.sendStatus(200)
    })

    app.post(`/api/settings/v2/set`, async (req, res) => {
        await require("./settings.js").setSetting(uid, req.body)
        res.send("[]")
    })

    app.post(`/api/players/v*/createProfile`, async (req, res) => {
        console.log(req.body)
        res.sendStatus(404)
    })

    app.post(`/api/players/v2/displayname`, async (req, res) => {
        let newname = await require("./datamanager.js").setName(uid, req.body)
        res.send(JSON.stringify(newname))
    })

    app.post(`/api/avatar/v2/set`, async (req, res) => {
        await require("./avatar.js").saveAvatar(uid, req.body)
        res.send("[]")
    })

    app.post(`/api/players/v1/list`, async (req, res) => {
        let resp = await getPlayerArray(req.body)
        res.send(resp)
    })

    app.post(`/api/gamesessions/v2/joinrandom`, async (req, res) => {
        const ses = await require("./sessions.js").joinRandom(uid, req.body)
        res.send(ses)
    })

    app.post(`/api/gamesessions/v2/create`, async (req, res) => {
        const ses = await require("./sessions.js").create(uid, req.body)
        res.send(ses)
    })

    const server = app.listen(port, () => {
        log(LogType.Info, `Server started on port ${port}`)
        require("./ws.js").serve(server)
    })
}

module.exports = { start }