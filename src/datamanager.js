const { makeUserJSONFromDB } = require("../util.js")
const fs = require("fs")

const db = process.db.users

async function getProfile(uid) {
    let [ userdata, justCreated ] = await db.findOrCreate({ where: {id: uid} })

    //this code will only execute if the user is new to LunarRec
    if (userdata.username == null) {
        userdata.update({ username: `LunarRecUser_${userdata.id}`, display_name: `LunarRecUser_${userdata.id}` })
        fs.copyFile('./profileImages/__default.png', `./profileImages/${userdata.id}.png`, (err) => {
            if (err) throw err;
        })
    }

    return makeUserJSONFromDB(userdata);
}

async function setName(uid, req) {
    let data = await require("./decodeRequest.js").decodeRequest(req)
    data = data.slice(5)

    let userdata  = await db.findOne({ where: {id: uid} })

    newname = decodeURIComponent(data)

    try {
        await userdata.update({ username: decodeURIComponent(data), display_name: decodeURIComponent(data).replace(/ /g,"_") })
        return {Success: false, Message: `Name changed to "${newname}"! Changes will be visible when client is restarted.`};
    } catch(e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {Success: false, Message: `Name "${newname}" is already in use!`};
        } else {
            return {Success: false, Message: `Failed to set name to "${newname}".`};
        }
    }
}

module.exports = { getProfile, setName }