const crypto = require('crypto');
const hash = crypto.createHash('md5');

module.exports = async function (text) {
    hash.update(text)
    return hash.digest('hex')
}
