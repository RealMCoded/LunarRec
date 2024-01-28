const express = require('express')
const router = express.Router()
const { targetVersion, instance_info, allow2016AndEarly2017 } = require("../../config.json")
const { version } = require("../../package.json")
const { getPlayerTotal, getOnlinePlayers } = require("../players.js")

/* GET REQUESTS */
router.get('/', async (req, res) => {
    res.json({
        name: instance_info.name,
        description: instance_info.description,
        owner: instance_info.owner,
        website: instance_info.website,
        targetVersion: targetVersion,
        ping: undefined, //TODO: Calculate Ping
        secure: allow2016AndEarly2017,
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

router.get('/test', (req, res) => {
    res.send("unauthorized endpoint works")
})

/* POST REQUESTS */


module.exports = router