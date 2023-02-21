const { makeUserJSONFromDB } = require("../util.js")

const db = process.db.users

async function getProfile(uid) {
    let [ userdata, justCreated ] = await db.findOrCreate({ where: {id: uid} })

    //this code will only execute if the user is new to LunarRec
    if (userdata.username == null) {
        userdata.update({ username: `LunarRecUser_${userdata.id}`, display_name: `LunarRecUser_${userdata.id}` })
    }

    return makeUserJSONFromDB(userdata);
}

module.exports = { getProfile }