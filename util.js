function random(number) {
    return Math.floor(Math.random() * number)
}

function makeUserJSONFromDB(userdata) {
    return JSON.stringify({
        "Id": userdata.id,
        "Username": userdata.username,
        "DisplayName": userdata.username,
        "XP": userdata.xp,
        "Level": userdata.level,
        "Reputation": userdata.reputation,
        "Verified": true,
        "Developer": userdata.isDev,
        "HasEmail": true,
        "CanReceiveInvites": false,
        "ProfileImageName": userdata.id,
        "JuniorProfile": false,
        "ForceJuniorImages": false,
        "PendingJunior":false,
        "HasBirthday": true
    })
}

module.exports = { random, makeUserJSONFromDB }