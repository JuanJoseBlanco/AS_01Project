import fs from "fs"

let logger = fs.createWriteStream('log.txt', {
    flags: 'a'
})

export const writeLogs = (date, message) => {
    let formatTime = date.toLocaleDateString() +' ' +date.toLocaleTimeString()
    logger.write(formatTime +'\t' +message +'\n')
}

