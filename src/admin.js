async function admin() {
    console.log("Welcome to the Admin Panel! Run \"help\" for help.\n")

    let command;
    const db = process.db;
    const readline = require('readline')
    const fs = require("node:fs")
    const jwt = require("jsonwebtoken")
    const { token_signature} = require("../config.json")
    const { version } = require("../package.json")

    const cmd = readline.createInterface(process.stdin, process.stdout);
    cmd.setPrompt('> ')
    cmd.prompt();
    cmd.on('line', async line => {
        command = line.split(' ')
        console.log("")
        switch (command[0]) {
            case '': {} break;
            case 'help': {console.log('help - displays this\nexit - exit the admin panel\neval - run js code\ncreate - create a user\ndelete - delete a user\ntoggle-dev - toggle a users "developer" status.\ncreate-auth-token - create a temporary 30 minute auth token for development purposes.\ntoken-info - get info about a token');} break;
            case 'exit': {console.log("Bye!"); cmd.close(); process.exit(0);} break;
            case 'eval': {
                try {
                    eval(line.trim().substring(4))
                } catch (error) {
                    console.error(error)
                }
            } break;
            case 'create': {
                if (command.length-1 != 3) return console.log("usage: create <id> <username> <display_name>")

                try {
                    await db.users.create({id: command[1], username: command[2], display_name: command[3]})
                    fs.copyFile('./cdn/profileImages/__default.png', `./cdn/profileImages/${command[1]}.png`, (err) => {
                        if (err) throw err;
                    })
                    console.log(`Created new account with "${command[3]}" (@${command[2]}) with the ID of ${command[1]}`)
                } catch(e) {
                    console.log(`An error happened while executing that command! ${e}`)
                }
            } break;
            case 'delete': {
                if (command.length-1 != 2) return console.log("usage: delete id <id>\n      delete username <username>")

                try {
                    if (command[1] == "id") {
                        await db.users.destroy({where: {id: command[2]}})
                        console.log(`Deleted account with id "${command[2]}"`)
                    } else if (command[1] == "username") {
                        await db.users.destroy({where: {username: command[2]}})
                        console.log(`Deleted account with username "${command[2]}"`)
                    } else {
                        console.log(`Invalid mode specified. Expected "id" or "username", got "${command[1]}"`)
                    }
                } catch(e) {
                    console.log(`An error happened while executing that command! ${e}`)
                }
            } break;
            case 'toggle-dev': {
                if (command.length-1 != 2) return console.log("usage: toggle-dev id <id>\n      set-dev username <username>")

                try {
                    if (command[1] == "id") {
                        var user = await db.users.findOne({where:{id: command[2]}})
                        await user.update({isDev: !user.isDev})
                        console.log(`Dev mode set to "${user.isDev}" for user ID "${command[2]}"`)
                    } else if (command[1] == "username") {
                        var user = await db.users.findOne({username:{id: command[2]}})
                        await user.update({isDev: !user.isDev})
                        console.log(`Dev mode set to "${user.isDev}" for user with username "${command[2]}"`)
                    } else {
                        console.log(`Invalid mode specified. Expected "id" or "username", got "${command[1]}"`)
                    }
                } catch(e) {
                    console.log(`An error happened while executing that command! ${e}`)
                }
            } break;
            case 'create-auth-token': {
                if (command.length-1 != 1) return console.log("usage: create-auth-token <id>")

                try {
                    var user = await db.users.findOne({where:{id: command[1]}})

                    let token_temp = {
                        Platform: '0',
                        PlatformId: user.linked_steam_id,
                        Name: user.username,
                        AppVersion: `LunarRec_${version}_${process.commit}`,
                        ClientTimestamp: Math.floor(Date.now() / 1000),
                        PlayerId: command[1],
                        Verify: 'AdminPanelToken'
                    }

                    const token = jwt.sign(token_temp, token_signature, {expiresIn: "30m"});

                    console.log(`Your auth token is "${token}"\n\nExpires in 30 minutes. Don't share with anyone else.`)
                } catch(e) {
                    console.log(`Something bad happened! ${e.message}`)
                }
            } break;
            case 'token-info': {
                if (command.length-1 != 1) return console.log("usage: token-info <token>")

                jwt.verify(command[1], token_signature, (err, decoded) => {
                    if (err) {
                        let err_msg = err
                        switch(err.message) {
                            case "jwt expired": {err_msg = `The token you have provided has expired.`}
                            case "invalid signature": {err_msg = `The token you have provided has an invalid signature.`}
                        }
                        return console.log(`Something bad happened! ${err_msg}`)
                    }

                    console.log(decoded)
                  });
            } break;
            case 'announce': {
                if (command.length-1 != 1) return console.log("usage: announce <message>")

                console.log("NOT READY YET")
            } break;
            default: {console.log('Invalid command. Run "help" for help')} break;
        }
        cmd.prompt();
    })
}

module.exports = {admin}