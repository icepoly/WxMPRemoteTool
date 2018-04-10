const db= require('../middlewares/db')

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        var update = db.updateTaskState(ctx.state.$wxInfo.userinfo.openId, ctx.request.body, 1)
        await update.then(res => {
            if (res === 0) {
                ctx.body = 'success'
            }
            else{
                ctx.state.code = res
            }
        })

    } else {
        ctx.state.code = -1
    }
}
