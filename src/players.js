const { allow2016AndEarly2017  } = require("../../config.json")
const db = process.db.users
const sequelize = require(`sequelize`)
const { Op } = require('sequelize');
const {makeUserJSONFromDB} = require("../util.js")

async function getPlayerArray(req){
    let json = req

    let response = [];

    for(const plr in json){
        let userdata = await db.findOne({ where: {id: req[plr]} })
        response.push(JSON.parse(makeUserJSONFromDB(userdata)))
    }

    return response
}

async function playerSearch(name) {
    let lookupValue = name.toLowerCase();
    let resp = []

    let index = await db.findAll({
        limit: 10,
        where: {
            username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), 'LIKE', '%' + lookupValue + '%')
        }
    })

    for(const plr in index){
        resp.push(JSON.parse(makeUserJSONFromDB(index[plr])))
    }

    return resp
}

async function getOnlinePlayers(){
    return await db.count({where: {session:{[Op.not]: null}}})
}

async function getPlayerTotal(){
    return await db.count()
}

module.exports = { getPlayerArray, getPlayerTotal, getOnlinePlayers, playerSearch }