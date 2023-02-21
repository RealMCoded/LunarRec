const db = process.db.users

async function loadSettings(uid){
    let userdata  = await db.findOne({ where: {id: uid} })

    return userdata.settings
}

async function setSetting(uid){

}

module.exports = { loadSettings, setSetting }