const { mysql: config } = require('../config')
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

async function checkUserInfo(open_id){
    return DB('cUserInfo').whereRaw('open_id = ?',open_id).then(res =>{
        if(JSON.stringify(res) == "[]"){
            return 0
        }
        else {
            return res[0].permission
        }}, err => {
            return 0
        })
}

async function updateTaskState(open_id, data, state){
    return DB('cTaskInfo')
    .where('open_id', '=', open_id)
    .where('state', '=', 0)
    .update({
      state: state,
      type: data.type,
      optype: data.optype,
      opdata: data.opdata,
    }).then(res =>{
        if(JSON.stringify(res) == "[]"){
            return false
        }
        else {
            return true
        }}, err => {
            return false
        })
}

module.exports = { checkUserInfo, updateTaskState }
