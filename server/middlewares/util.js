const crypto = require('crypto');
const hash = crypto.createHash('md5');

var md5crypto = (content) => {
    hash.update(content)
    return hash.digest('hex')
}

module.exports = { md5crypto }
