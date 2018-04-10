const db= require('../middlewares/db')

async function get (ctx, next) {
    const { openid } = ctx.query
    var get = db.acceptJob(openid)
    await get.then(res => {
        ctx.state.data = res
    })
}

module.exports = {
    get
}
