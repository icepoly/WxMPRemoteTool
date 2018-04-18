const { mysql: config } = require('../config')
const { tokenkey: tokenkey } = require('../config')
const util= require('../middlewares/util')

var arguments = process.argv.splice(2)

if(arguments.length != 2) {
   console.log('参数错误！')
   process.exit(0)
}

const DB = require('knex')({
    client: 'mysql',
    connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.pass,
        database: config.db,
        charset: config.char,
        multipleStatements: true
    }
})

console.log('\n======================================')
console.log('开始AddUser...')

DB('cUserInfo').where('open_id', '=', arguments[0]).update({permission: arguments[1]}).then(res =>{
    if(JSON.stringify(res) == "[]"){
            console.log('adduser失败！')
            process.exit(0)
    }
    else {
            var open_id = new Buffer(arguments[0]).toString('base64');
            var skey = new Buffer(util.md5crypto(arguments[0] + config.tokenkey)).toString('base64');
            console.log('adduser成功！open_id:%s skey:%s',open_id, skey)
            process.exit(0)
    }}, err => {
        throw new Error(err)
    })
