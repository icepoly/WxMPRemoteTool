async function get (ctx, next) {
    const { signature, timestamp, nonce, echostr } = ctx.query
    console.log('task get: ',ctx.query)
}

async function post (ctx, next) {
    const { signature, timestamp, nonce } = ctx.query
    const body = ctx.request.body

    ctx.body = 'success'

    console.log('task post: ',ctx.request.body)
}

module.exports = {
    post,
    get
}
