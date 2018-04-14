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

async function queryTaskInfo(open_id){
    var data = {}
    return DB('cTaskInfo').whereRaw('open_id = ?',open_id).then(res =>{
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
}

async function updateTaskInfo(open_id, data){
    return DB('cTaskInfo').where('open_id', '=', open_id).where('state', '!=', 1).update({
        state: 1,
        type: data.type,
        optype: data.optype,
        opdata: data.opdata,
      }).then(res =>{
          if(res === 0){
              return 0x10
          }
          else {
              return 0x00
          }}, err => {
              return 0x11
          })
}

async function addTask(open_id, data){
    var checkret = await checkUserInfo(open_id).then(res => {
        if (res <= 0) {
            return 0x01
        }
        else{
            return 0x00
        }})
    
    if(checkret === 0x00){
        return await updateTaskInfo(open_id, data).then(res => {
            return res
        })
    }
    else
    {
        return checkret
    }
}

async function queryJobInfo(open_id){
    var data = {}
    return DB('cTaskInfo').where('state', '=', 1).whereRaw('open_id = ?',open_id).then(res =>{
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
}

async function updateJobInfo(open_id, state, data){
    return DB('cTaskInfo').where('open_id', '=', open_id).where('state', '!=', 0).update({
        state: state,
        opdata: data,
      }).then(res =>{
          if(res === 0){
              return false
          }
          else {
              return true
  }}, err => {
      return false
  })
}

async function acceptJob(open_id){
    var data = {}
    var checkret = await checkUserInfo(open_id).then(res => {
        if (res <= 0) {
            return false
        }
        else{
            return true
        }
    })
    if(checkret){
        data = await queryJobInfo(open_id).then(res => {
            return res
        })
        var ret = await updateJobInfo(open_id, 2, "accept job").then(ret => {
            return ret
        })
        if(ret){
            return data
        }
        else{
            return data
        }
    }
    else
    {
        return data
    }
}

module.exports = { addTask, acceptJob, queryTaskInfo, updateJobInfo}
