const db = process.db.users

async function loadAvatar(uid){
    let userdata  = await db.findOne({ where: {id: uid} })

    return userdata.avatar

}

module.exports = { loadAvatar }