import { gLog } from '../log/Logger.js';

const regeneratorRuntime = require('../../../src/libs/regenerator-runtime/runtime.js');


let __instance = undefined

class DebugMgr {

    static getIns() {
        if (!__instance)
            __instance = new DebugMgr()
        return __instance
    }

    constructor() {

    }

    testFn000() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // resolve(true, "--- world")
                resolve({flag: true, res:"--- world"})
            }, 3000);
        })
    } 

    async testFn001() {
        gLog("--- aaa 222")
        let bbb = await this.testFn000()
        gLog("--- bbb 222", bbb)
        return "wolegequ"
    }

    testFn002() {
        let cnt = 0
        let tmr = setInterval(() => {
          cnt++
          if (cnt > 3) {
            clearInterval(tmr)
            return
          }
    
          gLog("--- aaa")
        }, 1000)
    }

}

export default DebugMgr