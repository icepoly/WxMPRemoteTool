// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState ) {
        var check = checkUserInfo(ctx.state.$wxInfo.userinfo.userinfo.openId)
        await check.then(res =>{
            if(res != -1){
                ctx.state.data = ctx.state.$wxInfo.userinfo
                ctx.state.uId = res
            }})
    }
}

