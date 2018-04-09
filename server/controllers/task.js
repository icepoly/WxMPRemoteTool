async function post (ctx, next) {
    const body = ctx.request.body
    ctx.body = 'success'
}

module.exports = {
    post
}
