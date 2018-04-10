const { mysql: config } = require('../config')

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
            console.log('adduser成功！')
            process.exit(0)
    }}, err => {
        throw new Error(err)
    })
