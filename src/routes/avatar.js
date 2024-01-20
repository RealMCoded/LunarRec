const express = require('express')
const router = express.Router()
const {loadAvatar, saveAvatar} = require("../avatar.js")
const path = require("path")

/* GET REQUESTS */
router.get(`/v2`, async (req, res) => {
    let body = await loadAvatar(req.uid)
    res.send(body)
})

router.get(`/v3/items`, async (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../../shared-items/avataritems.txt`))
})

router.get('/v2/gifts', (req, res) => {
    res.send("[]")
})

/* POST REQUESTS */

router.post(`/v2/set`, async (req, res) => {
    await saveAvatar(req.uid, req.body)
    res.send("[]")
})

module.exports = router