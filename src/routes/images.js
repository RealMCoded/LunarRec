const express = require('express')
const router = express.Router()
const path = require("path")
const fs = require("fs")
const {setPFP, uploadImg, deleteImg} = require("../image.js")

/* GET REQUESTS */
router.get('/v1/profile/:id', (req, res) => {
    try {
        const filedir = `${__dirname}/../../cdn/profileImages/${req.params.id}.png`;
        if (fs.existsSync(filedir)) {
            res.sendFile(path.resolve(filedir))
        } else {
            res.sendStatus(404)
        }
    } catch(e) {
        res.sendStatus(500)
    }
})

router.get('/v1/named', (req, res) => {
    if (customPosters) {
        const filedir = `${__dirname}/../../cdn/posters/${req.query.img}.png`
        if (fs.existsSync(filedir)) {
            res.sendFile(path.resolve(filedir))
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
})

/* POST REQUESTS */

router.post('/v*/profile', async (req, res) => {
    await setPFP(req.uid, req)
    res.send(JSON.stringify({ImageName: req.uid}))
})

router.post('/v*/uploadtransient', async (req, res) => {
    const img = await uploadImg(true, req.uid, req)
    res.send(img)
})

router.post('/v*/deletetransient', async (req, res) => {
    await deleteImg(req)
    res.sendStatus(200)
})

module.exports = router