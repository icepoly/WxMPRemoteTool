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
            return false
        }
        else {
            return true
        }}, err => {
            return false
        })
}

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState && ctx.state.$wxInfo.userinfo) {
        var check = checkUserInfo(ctx.state.$wxInfo.userinfo.openId)
        await check.then(res =>{
            if(res){
                ctx.state.data = ctx.state.$wxInfo.userinfo
            }})
 
    }
}
