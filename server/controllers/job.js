async function get (ctx, next) {
    const { signature, timestamp, nonce, echostr } = ctx.query
}

module.exports = {
    get
}
