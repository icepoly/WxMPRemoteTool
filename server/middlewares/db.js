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
<<<<<<< HEAD
            return -0x10
=======
            return 0
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
        }
        else {
            return res[0].permission
        }}, err => {
<<<<<<< HEAD
            return -0xFF
=======
            return -1
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
        })
}

async function queryTaskInfo(open_id){
    var data = {}
    return DB('cTaskInfo').whereRaw('open_id = ?',open_id).then(res =>{
        if(JSON.stringify(res) == "[]"){
<<<<<<< HEAD
            return -0x10
=======
            return 0
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
        }
        else {
            data.state = res[0].state
            data.type = res[0].type
            data.optype =res[0].optype
            data.opdata =res[0].opdata        
            return data
        }}, err => {
<<<<<<< HEAD
            return -0xFF
=======
            return -1
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
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
<<<<<<< HEAD
              return -0x10
=======
              return 0
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
          }
          else {
              return 1
          }}, err => {
<<<<<<< HEAD
              return -0xFF
=======
              return -1
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
          })
}

async function addTask(open_id, data){
    var checkret = await checkUserInfo(open_id).then(res => {
        return res
    })
    if(checkret > 0){
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
<<<<<<< HEAD
            return -0x10
=======
            return 0
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
        }
        else {
            data.type = res[0].type
            data.optype =res[0].optype
            data.opdata =res[0].opdata        
            return data
        }}, err => {
<<<<<<< HEAD
            return -0xFF
=======
            return -1
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
        })    
}

async function updateJobInfo(open_id, state, data){
    return DB('cTaskInfo').where('open_id', '=', open_id).where('state', '!=', 0).update({
        state: state,
        opdata: data,
      }).then(res =>{
          if(res === 0){
<<<<<<< HEAD
              return -0x10
=======
              return 0
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
          }
          else {
              return 1
  }}, err => {
<<<<<<< HEAD
      return -0xFF
=======
      return -1
>>>>>>> 44e0bb377825f60175f1a7906afa2e1d259d123a
  })
}

async function acceptJob(open_id){
    var checkret = await checkUserInfo(open_id).then(res => {
        return res
    })
    if(checkret > 0){
        var data = await queryJobInfo(open_id).then(res => {
            return res
        })
        var updateret = await updateJobInfo(open_id, 2, "accept job").then(ret => {
            return ret
        })
        if(updateret > 0){
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
