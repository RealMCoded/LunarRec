const express = require('express')
const router = express.Router()
const datamanager = require("../datamanager.js")
const {getPlayerTotal, getOnlinePlayers, getPlayerArray, playerSearch} = require("../players.js")

/* GET REQUESTS */
router.get(`/v2/search`, async (req, res) => {
    console.log(req.query)
    let body = await playerSearch(req.query.name)
    console.log(body)
    res.send(JSON.stringify(body))
})

router.get(`/v1/list`, async (req, res) => {
    res.send("[1, 11]")
})

router.get(`/v1/blockduration`, async (req, res) => {
    res.send("[]")
})

router.get(`/v1/phonelastfour`, async (req, res) => {
    res.send("{\"PhoneNumber\":\"PHONE NUMBERS ARE NOT SUPPORTED!\"}")
})

router.get(`/v1/search/*`, async (req, res) => {
    res.sendStatus(404)
})

router.get(`/v1/*`, async (req, res) => {
    let body = await datamanager.getProfile(req.uid)
    body = JSON.parse(body)
    res.send(JSON.stringify(body))
})

/* POST REQUESTS */
router.post(`/v1/getorcreate`, async (req, res) => {
    if (allow2016AndEarly2017) {
        body = req.body.PlatformId
        let accs = await datamanager.getAssociatedAccounts(body)
        if (accs.length == 0) {
            let acc = await datamanager.createAccount(`LunarRecUser_${await getPlayerTotal()+1}`, body)
            accs = [JSON.parse(acc)]
        }

        res.send(JSON.stringify([accs[0]]))
    } else {
        res.sendStatus(405)
    }
})

router.post(`/v2/phone`, async (req, res) => {
    res.send(JSON.stringify({Success:false, Message:"Phone Numbers are not supported!"}))
})

router.post(`/v1/list`, async (req, res) => {
    console.log(req.body)
    let resp = await getPlayerArray(req.body)
    console.log(resp)
    res.send(JSON.stringify(resp))
})

router.post(`/v2/displayname`, async (req, res) => {
    let newname = await datamanager.setName(req.uid, req.body)
    res.send(JSON.stringify(newname))
})

router.post(`/v*/createProfile`, async (req, res) => {
    let acc = await datamanager.createAccount(req.body.Name, req.plat)
    res.send(acc)
})

module.exports = router