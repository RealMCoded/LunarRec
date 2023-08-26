const { LogType, log } = require("./src/logger.js")
const fs = require("node:fs")

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

function resetServerData() {
    log(LogType.Info, "Deleting Database...")
    try {
		fs.unlinkSync("./database.sqlite")
	} catch(e){
		log(LogType.Error, `Something bad happened while erasing the database. If the database never existed, this is expected.\n\n${e}`)
	}

	log(LogType.Info, "Deleting Images (1/2 | Profile Pictures)...")
	let dir_pfp = "./cdn/profileImages/"
	const files_pfp = fs.readdirSync(dir_pfp);
	files_pfp.forEach((file) => {
		if (file === "__default.png") return;
		fs.unlinkSync(`${dir_pfp}/${file}`);
	});

	log(LogType.Info, "Deleting Images (2/2 | Share Cam)...")
	let dir_img = "./cdn/images/"
	const files_img = fs.readdirSync(dir_img);
	files_img.forEach((file) => {
		if (file === ".gitkeep") return;
		fs.unlinkSync(`${dir_img}/${file}`);
	});
    log(LogType.Info, "Reset complete!")
	process.exit()
}

module.exports = { random, makeUserJSONFromDB, resetServerData }