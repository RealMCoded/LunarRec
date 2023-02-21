const chalk = require('chalk') // colored text
const express = require('express') //express.js - the web server
const morgan = require('morgan') //for webserver output
const app = express()
const path = require("path")
app.use(morgan(`${chalk.magenta("[CDN]")} :method ":url" :status - :response-time ms`))
const { ports } = require("../config.json")

let port = ports.IMG

function start(){
    try {
        serve()
    } catch(e) {
        console.error(e)
    }
}

function serve() {
    app.get('/', (req, res) => {
        res.send("<p>LunarRec CDN server</p>")
    })
    /*
        Right now this only sends the users profile picture, as that is all the CDN appears to be used for in the context of 2017.
        The posters are still a big issue that i want to tackle, i just don't know how because it doesn't make any requests to the CDN for poster data.
    */
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/../profileImages/__default.png`))
    })
    
    app.listen(port, () => {
        console.log(`${chalk.magenta("[CDN]")} CDN started on port ${port}`)
    })
}

module.exports = { start }