const db= require('../middlewares/db')
const util= require('../middlewares/util')
const config = require('../config')

async function get (ctx, next) {
    const { open_id, skey } = ctx.query
    var res = util.md5crypto(open_id + config.tokenkey)
    if(res == skey){
        var get = db.acceptJob(open_id)
        await get.then(res => {
            ctx.body = res
        })
    }
    else
    {
        ctx.state.code = -1
    }
}

async function post (ctx, next) {
    const body = ctx.request.body
    var res = util.md5crypto(body.open_id + config.tokenkey)
    if(res == body.skey){
        var update = db.updateJobInfo(body.open_id, 0, body.msg)
        await update.then(res => {
            ctx.body = res
        })
    } else {
        ctx.state.code = -1
    }
}

module.exports = {
    get, post
}
