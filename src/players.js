

async function getPlayerArray(req){
    let json, resp;
    json = await require("./decodeRequest.js").decodeRequest(req)
    json = JSON.parse(json)

    console.log(json)

    for(const plr in json){
        //let userdata = await db.findOne({ where: {id: uid} })
    }
}

module.exports = { getPlayerArray }