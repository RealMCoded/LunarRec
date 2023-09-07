const { makeUserJSONFromDB } = require("../util.js")
const fs = require("fs")
const { dataType, webhookMessage } = require("./webhook.js")

const db = process.db.users

async function getAssociatedAccounts(steamID) {
    let accounts = await db.findAll({where:{linked_steam_id: steamID}})
    let accountArray = []

    accounts.forEach(async element => {
        //clear session - for builds that don't send logout
        accountArray.push(JSON.parse(makeUserJSONFromDB(element)))
        await element.update({session: null})
    });
    return accountArray
}

async function createAccount(uname, steamID) {
    let user = await db.create({username: uname, display_name: uname, linked_steam_id: steamID})
    fs.copyFile('./cdn/profileImages/__default.png', `./cdn/profileImages/${user.id}.png`, (err) => {
            if (err) throw err;
    })

    webhookMessage(dataType.AccountCreate, user)

    return makeUserJSONFromDB(user);
}

async function getProfile(uid) {
    let userdata= await db.findOne({ where: {id: uid} })

    webhookMessage(dataType.PlayerOnline, userdata)

    return makeUserJSONFromDB(userdata);
}

async function setName(uid, req) {
    let data = req.Name

    let userdata  = await db.findOne({ where: {id: uid} })

    newname = decodeURIComponent(data)

    try {
        await userdata.update({ username: decodeURIComponent(data), display_name: decodeURIComponent(data).replace(/ /g,"_") })
        return {Success: false, Message: `Name changed to "${newname}"! Restart to view changes.`};
    } catch(e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {Success: false, Message: `Name "${newname}" is already in use!`};
        } else {
            return {Success: false, Message: `Failed to set name to "${newname}".`};
        }
    }
}

module.exports = { createAccount, getAssociatedAccounts, getProfile, setName }