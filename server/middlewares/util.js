const crypto = require('crypto')

var md5crypto = (content) => {
    var hash = crypto.createHash('md5')
    hash.update(content)
    return hash.digest('hex')
}

var logout = (content) => {
    var date = new Date()
    console.log("logout: ", date, content)
}

module.exports = { md5crypto, logout }
