const db = process.db.users
const { Op } = require('sequelize');

async function getPlayerArray(req){
    let json;
    json = await require("./decodeRequest.js").decodeRequest(req)
    json = JSON.parse(json)

    let response = new Array;

    for(const plr in json){
        let userdata = await db.findOne({ where: {id: plr} })
        response.push(userdata)
    }

    return response
}

async function getOnlinePlayers(){
    return await db.count({where: {session:{[Op.not]: null}}})
}

async function getPlayerTotal(){
    return await db.count()
}

module.exports = { getPlayerArray, getPlayerTotal, getOnlinePlayers }