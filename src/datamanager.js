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

module.exports = { getProfile }