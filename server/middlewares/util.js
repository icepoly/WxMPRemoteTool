const crypto = require('crypto');

var md5crypto = (content) => {
    var hash = crypto.createHash('md5');
    hash.update(content)
    return hash.digest('hex')
}

module.exports = { md5crypto }
