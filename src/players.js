const db = process.db.users
const { Op } = require('sequelize');

async function getPlayerArray(req){
    let json, resp;
    json = await require("./decodeRequest.js").decodeRequest(req)
    json = JSON.parse(json)

    console.log(json)

    for(const plr in json){
        //let userdata = await db.findOne({ where: {id: uid} })
    }
}

async function getOnlinePlayers(){
    return await db.count({where: {session:{[Op.not]: null}}})
}

async function getPlayerTotal(){
    return await db.count()
}

module.exports = { getPlayerArray, getPlayerTotal, getOnlinePlayers }