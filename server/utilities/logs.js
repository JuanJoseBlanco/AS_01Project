import fs from "fs"

let logger = fs.createWriteStream('log.txt', {
    flags: 'a'
})

export const writeLogs = (date, message) => {
    logger.write(date +'\t' +message +'\n')
}

