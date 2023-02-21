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
    console.log(data)

    let userdata  = await db.findOne({ where: {id: uid} })

    userdata.update({ username: data, display_name: data })
    return data;
}

module.exports = { getProfile, setName }