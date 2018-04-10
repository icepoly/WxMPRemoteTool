const db= require('../middlewares/db')

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        var check = db.checkUserInfo(ctx.state.$wxInfo.userinfo.openId)
        await check.then(res => {
            if (res > 0) {
                const body = ctx.request.body
                var jsondata = JSON.parse(body)
                var update = db.updateTaskState(ctx.state.$wxInfo.userinfo.openId, jsondata, 1)
                await update.then(res => {
                    if (res > 0) {
                        ctx.body = 'success'
                    }
                    else{
                        ctx.state.code = -1
                    }
                })
            }
            else{
                ctx.state.code = -1
            }
        })

    } else {
        ctx.state.code = -1
    }
}
