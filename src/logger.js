const chalk = require("chalk")
const colors = require("../colors.json")

/***
 * Enum for log()
 * @readonly
 * @enum {number}
 */
const LogType = {
    Info: 0,
    Warn: 1,
    Error: 2,
    API: 3, 
    WS: 4,
    Bot: 5
}

/***
 * log but no console output
 * @param {Enumerator<LogType>} type - The Type of message to log
 * @param {string} message - The message to log
 */
function log_raw(type, message) {
    let msg_format;
    switch(type) {
        case 0: { msg_format = `${chalk.hex(colors.info)("[INFO]")} ${message}` } break;
        case 1: { msg_format = `${chalk.hex(colors.warn)("[WARN]")} ${message}` } break;
        case 2: { msg_format = `${chalk.hex(colors.error)("[ERROR]")} ${message}` } break;
        case 3: { msg_format = `${chalk.hex(colors.api)("[API]")} ${message}` } break;
        case 4: { msg_format = `${chalk.hex(colors.ws)("[WS]")} ${message}` } break;
        case 5: { msg_format = `${chalk.hex(colors.discord)("[BOT]")} ${message}` } break;
        default: { msg_format = `[UNKNOWN TYPE "${type}"] ${message}` } break;
    }

    return msg_format;
}

/***
 * console.log but prettier
 * @param {Enumerator<LogType>} type - The Type of message to log
 * @param {string} message - The message to log
 */
function log(type, message) {
    console.log(log_raw(type, message))

    return message;
}

module.exports = { LogType, log, log_raw }