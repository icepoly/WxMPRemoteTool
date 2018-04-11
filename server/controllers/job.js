const db= require('../middlewares/db')
const util= require('../middlewares/util')
const config = require('./config')

async function post (ctx, next) {
    const body = ctx.request.body
    var res = util.md5crypto(body.open_id + config.tokenkey)
    if(res == body.skey){
        var get = db.acceptJob(body.open_id)
        await get.then(res => {
            ctx.state.data = res
        })
    }
}

module.exports = {
    post
}
