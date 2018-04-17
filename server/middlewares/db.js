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
            return 0x10
        }
        else {
            return res[0].permission
        }}, err => {
            return 0xFF
        })
}

async function queryTaskInfo(open_id){
    var data = {}
    return DB('cTaskInfo').whereRaw('open_id = ?',open_id).then(res =>{
        if(JSON.stringify(res) == "[]"){
            return 0x10
        }
        else {
            data.state = res[0].state
            data.type = res[0].type
            data.optype =res[0].optype
            data.opdata =res[0].opdata        
            return data
        }}, err => {
            return 0xFF
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
              return 0xFF
          })
}

async function addTask(open_id, data){
    var checkret = await checkUserInfo(open_id).then(res => {
        return res
    })
    if(checkret === 0){
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
            return 0x10
        }
        else {
            data.type = res[0].type
            data.optype =res[0].optype
            data.opdata =res[0].opdata        
            return data
        }}, err => {
            return 0xFF
        })    
}

async function updateJobInfo(open_id, state, data){
    return DB('cTaskInfo').where('open_id', '=', open_id).where('state', '!=', 0).update({
        state: state,
        opdata: data,
      }).then(res =>{
          if(res === 0){
              return 0x10
          }
          else {
              return 0x00
  }}, err => {
      return 0xFF
  })
}

async function acceptJob(open_id){
    var checkret = await checkUserInfo(open_id).then(res => {
        return res
    })
    if(checkret === 0){
        var data = await queryJobInfo(open_id).then(res => {
            return res
        })
        var updateret = await updateJobInfo(open_id, 2, "accept job").then(ret => {
            return ret
        })
        if(updateret === 0){
            return data
        }
        else{
            return updateret
        }
    }
    else
    {
        return checkret
    }
}

module.exports = { addTask, acceptJob, queryTaskInfo, updateJobInfo}
