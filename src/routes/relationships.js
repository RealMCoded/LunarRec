const express = require('express')
const router = express.Router()

/* GET REQUESTS */
router.get('/v2/get', (req, res) => {
    res.send("[]")
})

/* POST REQUESTS */


module.exports = router