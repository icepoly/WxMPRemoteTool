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

async function addTask(open_id, data){
    var check = checkUserInfo(open_id)
    return await check.then(res => {
            if (res <= 0) {
                return 0x01
            }
            else
            {
                async function updateTaskInfo(open_id){
                    return DB('cTaskInfo').where('open_id', '=', open_id).where('state', '=', 0).update({
                        state: 1,
                        type: data.type,
                        optype: data.optype,
                        opdata: data.opdata,
                      }).then(res =>{
                          if(res === 0){
                              return 0x10
                          }
                          else {
                              return 0
                          }}, err => {
                              return 0x11
                          })
                }
                return await updateTaskInfo(open_id)
            }})

}

async function acceptJob(open_id){
    var check = checkUserInfo(open_id)
    var data = {}
    return await check.then(res => {
            if (res <= 0) {
                return data
            }
            else
            {
                async function queryJobInfo(open_id){
                    DB('cTaskInfo').where('state', '=', 1).whereRaw('open_id = ?',open_id).then(res =>{
                        if(JSON.stringify(res) == "[]"){
                            return data
                        }
                        else {
                            data.type = res[0].type
                            data.optype =res[0].optype
                            data.opdata =res[0].opdata        
                            return data
                        }}, err => {
                            return data
                        })

                async function updateTaskInfo(open_id){
                    return DB('cTaskInfo').where('open_id', '=', open_id).where('state', '=', 1).update({
                        state: 0
                      }).then(res =>{
                          if(res === 0){
                              return false
                          }
                          else {
                              return true
                  }}, err => {
                      return false
                  })

                  var query = queryJobInfo(open_id)
                  return await query.then(res => {

                    var update = updateTaskInfo(open_id)
                    return await update.then(ret => {
                        if(ret){
                            return res
                        }
                        else{
                            return data;
                        }
                    })
                })

}
module.exports = { AddTask, AcceptJob }
