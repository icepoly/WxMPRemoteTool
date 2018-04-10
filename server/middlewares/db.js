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
    var check = checkUserInfo(open_id)
    await check.then(res => {
            if (res <= 0) {
                return 0x01
            }
            else
            {
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
                        return 0x10
                    }
                    else {
                        return 0
                    }}, err => {
                        return 0x11
                    })
            }})

}

module.exports = { updateTaskState }
