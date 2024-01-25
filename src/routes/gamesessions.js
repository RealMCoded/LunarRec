const express = require('express')
const router = express.Router()
const {joinRandom, create} = require("../sessions.js")

/* GET REQUESTS */
router.get(`/v1/*`, async (req, res) => {
    res.send("[]")
})

/* POST REQUESTS */
router.post(`/v2/joinrandom`, async (req, res) => {
    const ses = await joinRandom(req.uid, req.body)
    res.send(ses)
})

router.post(`/v2/create`, async (req, res) => {
    const ses = await create(req.uid, req.body)
    res.send(ses)
})

module.exports = router