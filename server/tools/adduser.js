const fs = require('fs')
const path = require('path')

const { mysql: config } = require('../config')

const md5 = require('../middlewares/util')

var arguments = process.argv.splice(2);

if(arguments.length != 3) {
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

var content = "insert into cTaskInfo(uId) select uId from cUserInfo where open_id = \"" + arguments[0] +"\";"

function processContent(sqlContent){
DB.raw(content).then(res =>{
    console.log('AddUser成功！')
    process.exit(0)
}, err => {
    throw new Error(err)
})}

console.log('\n======================================')
console.log('开始AddUser...')

DB('cSessionInfo').whereRaw('open_id = ?',arguments[0]).then(res =>{
    if(JSON.stringify(res) == "[]"){
        console.log('open_id校验失败！')
        process.exit(0)
    }
    else {
        console.log('open_id校验成功！')
        DB('cUserInfo').insert({open_id: arguments[0], skey: md5crypto(arguments[1]), permission: arguments[2]}).then(res =>{
        if(JSON.stringify(res) == "[]"){
                console.log('adduser权限失败！')
                process.exit(0)
        }
        else {
                console.log('adduser权限成功！')
                processContent(content)
        }}, err => {
            throw new Error(err)
        })}
}, err => {
throw new Error(err)
})
