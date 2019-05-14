
// 日志封装

// TODO: 暂未对日志做等级控制 

function gLog(...args) {
    console.log(args)
}

function gWarn(...args) {
    console.warn(args)
}

function gError(...args) {
    console.error(args)
}

function gAssert(cond, ...args) {
    if (!cond)
        gError(args)
}

export { gLog, gWarn, gError, gAssert }
