const db = process.db.users

async function joinRandom(uid, req){
    let json = req

    var session = {
        Result: 0,
        GameSession: {
            GameSessionId: 2017,
            RegionId: "us",
            RoomId: json.ActivityLevelIds[0],
            RecRoomId: null,
            EventId: null,
            CreatorPlayerId: 1,
            Name: "LunarRec Room",
            ActivityLevelId: json.ActivityLevelIds[0],
            Private: false,
            Sandbox: false,
            SupportsScreens: true,
            SupportsVR: true,
            GameInProgress: false,
            MaxCapacity: 20,
            IsFull: false
        }
    }

    session = JSON.stringify(session)

    let userdata = await db.findOne({ where: {id: uid} })
    userdata.update({ session: session })

    return session;
}

async function create(uid, req){
    let json = req

    var session = {
        Result: 0,
        GameSession: {
            GameSessionId: 2017,
            RegionId: "us",
            RoomId: json.ActivityLevelId,
            RecRoomId: null,
            EventId: null,
            CreatorPlayerId: 1,
            Name: "LunarRec Room",
            ActivityLevelId: json.ActivityLevelId,
            Private: false,
            Sandbox: false,
            SupportsScreens: true,
            SupportsVR: true,
            GameInProgress: false,
            MaxCapacity: 20,
            IsFull: false
        }
    }

    session = JSON.stringify(session)
    let userdata = await db.findOne({ where: {id: uid} })
    userdata.update({ session: session })

    return session;
}

module.exports = { joinRandom, create }