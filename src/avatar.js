const db = process.db.users

async function loadAvatar(uid){
    let userdata  = await db.findOne({ where: {id: uid} })

    return userdata.avatar
}

async function saveAvatar(uid, req){
    let userdata = await db.findOne({ where: {id: uid} })
    userdata.update({ avatar: req })
}

module.exports = { loadAvatar, saveAvatar }