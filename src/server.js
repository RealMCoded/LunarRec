//Get variables from other files
const { targetVersion, port, serverAddress, logConnections, token_signature, allow2016AndEarly2017, rateLimits } = require("../config.json")
const { version } = require("../package.json")
const { LevelProgressionMaps, DailyObjectives } = require("../shared-items/configv2.json")

//Import Modules
const express = require('express') //express.js - the web server
const morgan = require('morgan') //for webserver output
const { rateLimit } = require("express-rate-limit")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const app = express()
const path = require("path")
const fs = require("fs")

//Import custom modules
const datamanager = require("./datamanager.js")
const { getPlayerTotal } = require("./players.js")
const { LogType, log, log_raw } = require("./logger.js")

//enable loggings and JSON encoded bodies
if (logConnections) app.use(morgan(log_raw(LogType.API, `:remote-addr :method ":url" :status - :response-time ms`)))
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

//Authentication
const authenticateToken = async (req, res, next) => {
    //Add lunarrec version header
    res.set('x-LunarRec-Version', version)
    res.set('Content-Type', 'application/json');

    // Define an array of endpoints that do not require authorization
    const noAuthRequired = [
        /^\/$/,
        /^\/img\/.+$/,
        /^\/instance\//,
        /^\/api\/versioncheck\//,
        /^\/api\/config\/v\d+$/,
        /^\/api\/platformlogin\/v\d+$/,
        /^\/api\/platformlogin\/v\d+\/profiles$/,
        /^\/\/api\/platformlogin\/v\d+$/, //For some 2017 june builds
        /^\/\/api\/platformlogin\/v\d+\/profiles$/, //For some 2017 june builds
        /^\/api\/players\/v\d+\/getorcreate$/,
    ];
    
    for (const endpointRegex of noAuthRequired) {
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

    //old build mode. see why it's insecure now?
    try {
        if(allow2016AndEarly2017 && Buffer.from(token).toString('base64') === "recroom@gmail.com:recnet87") {
            req.uid = req.headers['x-rec-room-profile']
            return next();
        }
    } catch(e) {}
  
    jwt.verify(token, token_signature, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.uid = decoded.PlayerId
      req.plat = decoded.PlatformId
      next();
    });
};

//Rate limiting, Taken from the npm page and tweaked a bit
const limiter = rateLimit({
	windowMs: rateLimits.window,
	limit: rateLimits.maxRequests,
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

/*
    Server code starts here.
    Smaller requests are still stored here, but most of the requests are stored in the /routes folder.
*/

//Debug logging
app.use((req, res, next) => {
    log(LogType.Debug, `[${req.method.toUpperCase()} "${req.url}"] API Request: ${JSON.stringify(req.body)}`)
    next()
})

//Use authentication and rate limiter
app.use(authenticateToken);
app.use(limiter)

/* ROUTES */
app.use("/api/players", require("./routes/players.js")) // http://localhost/api/players/
app.use("/api/avatar", require("./routes/avatar.js")) // http://localhost/api/avatar/
app.use("/api/images", require("./routes/images.js")) // http://localhost/api/images/
app.use("/api/settings", require("./routes/settings.js")) // http://localhost/api/settings/
app.use("/api/gamesessions", require("./routes/gamesessions.js")) // http://localhost/api/gamesessions/
app.use("/api/relationships", require("./routes/relationships.js")) // http://localhost/api/relationships/
app.use("/instance", require("./routes/lunarrec.js")) // http://localhost/instance

/* GET REQUESTS */

//Name Server
app.get('/', async (req, res) => {
    res.json(({NOTE: "LunarRec Name Server. If IPs are wrong check your config.", API:`${serverAddress}`, Notifications:`${serverAddress}`, Images:`${serverAddress}/img`}))
})

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

app.get(`/api/events/v*/list`, async (req, res) => {
    res.send("[]")
})

app.get('/api/config/v1/amplitude', (req, res) => {
    res.json(({AmplitudeKey: "NoKeyProvided"}))
})

app.get('/api/PlayerReporting/v1/moderationBlockDetails', async (req, res) => {
    let modstat = await datamanager.getModerationStatus(req.uid)
    console.log(modstat)
    if (modstat.isBanned) {
        res.json(({"ReportCategory":1,"Duration":600,"GameSessionId":-2000,"Message":`Moderator note: "${modstat.data.reason}".\nContact instance host to appeal`}))
    } else {
        res.json(({"ReportCategory":0,"Duration":0,"GameSessionId":0,"Message":""}))
    }
})

app.get('/api/equipment/v1/getUnlocked', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../shared-items/equipment.txt`))
})

app.get('/api/activities/charades/v1/words', (req, res) => {
    res.send(require("./charades.js").generateCharades())
})

app.get('/api/messages/v2/get', (req, res) => {
    res.send("[]")
})

app.get('/api/config/v2', (req, res) => {
    res.json(({
        MessageOfTheDay: fs.readFileSync("./shared-items/motd.txt", 'utf8'),
        CdnBaseUri: `${serverAddress}`,
        LevelProgressionMaps,
        MatchmakingParams:{
            PreferFullRoomsFrequency: 1,
            PreferEmptyRoomsFrequency: 0
        },
        DailyObjectives,
        ConfigTable: [{"Key":"Gift.DropChance","Value":"0.5"},{"Key":"Gift.XP","Value":"0.5"}],
        PhotonConfig: {"CloudRegion":"us","CrcCheckEnabled":false,"EnableServerTracingAfterDisconnect":false}
    }))
})

app.get('/img/:id', (req, res) => {
    try {
        const id = req.params.id
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

/* POST REQUESTS */

app.post('*/api/platformlogin/v*/profiles', async (req, res) => {
    body = req.body.PlatformId
    let accs = await datamanager.getAssociatedAccounts(body)
    if (accs.length == 0) {
        let acc = await datamanager.createAccount(`LunarRecUser_${await getPlayerTotal()+1}`, body)
        accs = [JSON.parse(acc)]
    }

    res.json((accs))
})

app.post('*/api/platformlogin/v*/', async (req, res) => {
    let body_JWT = req.body
    //remove any unused params to reduce bloat
    delete body_JWT.AuthParams
    delete body_JWT.BuildTimestamp
    delete body_JWT.DeviceId

    const token = jwt.sign(req.body, token_signature, {expiresIn: "12h"});
    res.json(({Token: token, PlayerId:body_JWT.PlayerId, Error: ""}))
})

app.post(`/api/PlayerSubscriptions/v1/init`, async (req, res) => {
    res.send("[]")
})

const server = app.listen(port, () => {
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            log(LogType.Debug, `Route: [${r.route.stack[0].method.toUpperCase()}] ${r.route.path}`)
        }
    })
    log(LogType.Info, `Server started on port ${port}`)
    require("./websocket.js").start(server)
})