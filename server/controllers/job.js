const db= require('../middlewares/db')
const util= require('../middlewares/util')
const config = require('../config')

async function get (ctx, next) {
    const { open_id, skey } = ctx.query
    var res = util.md5crypto(open_id + config.tokenkey)
    if(res == skey){
        var get = db.acceptJob(open_id)
        await get.then(res => {
        if(res){
            ctx.state.data = 'success'
        } else {
            ctx.state.code = -1
        }
        })
    }
}

async function post (ctx, next) {
    const body = ctx.request.body
    var res = util.md5crypto(body.open_id + config.tokenkey)
    if(res == body.skey){
        var get = db.updateJobInfo(body.open_id, 0, body.msg)
        await get.then(res => {
            ctx.state.data = res
        })
    }
}

module.exports = {
    get, post
}
