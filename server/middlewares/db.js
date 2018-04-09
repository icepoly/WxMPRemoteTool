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

var checkUserInfo = (open_id) => {
    return DB('cUserInfo').whereRaw('open_id = ?',open_id).then(res =>{
        if(JSON.stringify(res) == "[]"){
            return -1
        }
        else {
            return res[0].uId
        }}, err => {
            return -1
        })
}

var updateTaskState = (uId, type, opType, opData) => {
    DB('cTaskInfo')
    .where('uId', '==', uId)
    .where('state', '==', 0)
    .update({
      state: 1,
      type: type,
      optype: opType,
      opdata,opData,
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
