const db= require('../middlewares/db')

async function post (ctx, next) {
    const body = ctx.request.body
    var get = db.acceptJob(body.open_id)
    await get.then(res => {
        ctx.state.data = res
    })
}

module.exports = {
    post
}
