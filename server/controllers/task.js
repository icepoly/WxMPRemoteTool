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
    DB('cUserInfo').whereRaw('open_id = ?',aopen_id).then(res =>{
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
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1 || this.checkUserInfo(ctx.state.$wxInfo.open_id)) {
        // loginState 为 1，登录态校验成功
        const body = ctx.request.body
        ctx.state.code = 0
        ctx.body = 'success'
    } else {
        ctx.state.code = -1
    }
}
