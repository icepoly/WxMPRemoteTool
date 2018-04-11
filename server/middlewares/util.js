const crypto = require('crypto')

var md5crypto = (content) => {
    var hash = crypto.createHash('md5')
    hash.update(content)
    return hash.digest('hex')
}

var log = (content) => {
    var date = new Date()
    console.log("logtime: ", date.toLocaleString(), " log: ", content)
}

module.exports = { md5crypto, logout }
