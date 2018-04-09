// 登录授权接口
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

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState ) {
        var check = checkUserInfo(ctx.state.$wxInfo.userinfo.userinfo.openId)
        await check.then(res =>{
            if(res != -1){
                ctx.state.data = ctx.state.$wxInfo.userinfo.userinfo
                ctx.state.uId = res
            }})
    }
}

