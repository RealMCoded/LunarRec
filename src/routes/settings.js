const express = require('express')
const router = express.Router()
const {loadSettings, setSetting} = require("../settings.js")

/* GET REQUESTS */
router.get(`/v2`, async (req, res) => {
    res.send(await loadSettings(req.uid))
})

/* POST REQUESTS */
router.post(`/v2/set`, async (req, res) => {
    setSetting(req.uid, req.body)
    res.send("[]")
})

module.exports = router