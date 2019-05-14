import { gLog, gAssert } from '../log/Logger.js';
import { ERecoErr } from '../../common/Enum.js';
import Config from '../../common/Config.js';

// await 支持库
const regeneratorRuntime = require('../../libs/regenerator-runtime/runtime.js');

let __instance = undefined

class ArMgr {

    static getIns() {
        if (!__instance)
            __instance = new ArMgr()
        return __instance
    }

    constructor() {
        this.mSetting = undefined
        this.mCamCtx = undefined
        this.mPage = undefined

        this.mSuccessCb = undefined
        this.mFailCb = undefined

        this.mIsRecoing = false
        this.mIsShowing = false
        this.mRecoCnt = 0
        this.mTimer = undefined
        this.mShowTimer = undefined
    }

    //--- 对接小程序相关生命周期api begin ---
    OnCamViewLoad(page) {

        // 设置结构体如下
        this.mSetting = {}
        this.mSetting.imgUrl = Config.imgUrl
        this.mSetting.quality = Config.quality
        this.mSetting.recoCnt = Config.recoCnt
        this.mSetting.scanTime = Config.scanTime
        this.mSetting.resumeTime = Config.resumeTime

        // 创建摄像机ctx
        this.mCamCtx = wx.createCameraContext();
        this.mPage = page

        wx.getSystemInfo({
            success: res => {
                page.setData({ height: res.windowHeight });
            }
        });
    }

    OnCamViewUnload() {
        this.EndReco()
    }

    OnCamViewShow() {
        this.mIsShowing = true
        this.mShowTimer = setTimeout(() => {
            if (this.mIsRecoing) { // 识别中唤醒, n秒后才继续识别
                gLog(`--- OnCamViewShow, 识别中唤醒, 继续识别, 已识别 (${this.mRecoCnt}) 次:`)
                this.doScan()
            }
        }, this.mSetting.resumeTime);
    }

    OnCamViewHide() {
        this.mIsShowing = false
        clearInterval(this.mTimer)
        clearInterval(this.mShowTimer)
    }
    //--- 对接小程序相关生命周期api end ---

    // 主动开始识别接口
    StartReco(cbs) {
        gAssert(cbs.success != undefined, "--- 未设置 回调")
        gAssert(cbs.fail != undefined, "--- 未设置 回调")

        gAssert(this.mSetting.imgUrl != undefined, "--- 未设置 上传路径")
        gAssert(this.mSetting.quality != undefined, "--- 未设置 截图质量")
        gAssert(this.mSetting.recoCnt != undefined, "--- 未设置 识别次数")
        gAssert(this.mSetting.scanTime != undefined, "--- 未设置 识别周期")
        gAssert(this.mSetting.resumeTime != undefined, "--- 未设置 唤醒后识别时间")

        if (this.mIsRecoing)
            return;

        this.mSuccessCb = cbs.success
        this.mFailCb = cbs.fail
        this.mIsRecoing = true;
        this.mRecoCnt = 0
    }

    // 主动结束识别接口, 重置数据
    EndReco() {
        this.mCamCtx = undefined
        this.mPage = undefined
        this.mSuccessCb = undefined
        this.mFailCb = undefined
        this.mIsRecoing = false
        this.mIsShowing = false
        this.mRecoCnt = 0
        clearInterval(this.mTimer)
        clearInterval(this.mShowTimer)
    }

    async doScan() {
        gLog("--- doScan")
        let isLimited = await this.doTakePhoto()
        if (isLimited) {
            gLog("--- isLimited:", isLimited)
            return
        }

        this.mTimer = setInterval(() => {
            this.doTakePhoto()
        }, this.mSetting.scanTime)
    }

    async doTakePhoto() {
        this.mRecoCnt++
        if (this.mRecoCnt > this.mSetting.recoCnt) {
            this.doFail(ERecoErr.Reco, `--- 识别失败了 (${this.mSetting.recoCnt}) 次数:`)
            return true
        }

        gLog(`--- doTakePhoto 获取摄像机截图, 第 (${this.mRecoCnt}) 次识别`)
        let val = await this.adapterWxTakePhoto(this.mCamCtx, this.mSetting.quality)
        if (val.flag) {
            await this.searchPhoto(val.res.tempImagePath)
        } else {
            this.doFail(ERecoErr.TakePhoto, '--- 截取摄像机图片失败, err:' + val.res)
        }
    }

    async searchPhoto(filePath) {
        gLog("--- 上传本地图片 filePath:", filePath)

        let val = await this.adapterWxUploadImage(this.mSetting.imgUrl, filePath)
        gLog("--- http res:", val.res)
        if (val.flag && val.res.statusCode == 200) {
            let msg = JSON.parse(val.res.data);
            if (msg.statusCode == 0) { // 服务器定义 statusCode == 0 就是成功
                gLog("--- 识别成功 msg:", msg)
                gLog("--- 识别成功 图片 name:", msg.result.name)
                
                this.doSuccess(msg.result.name)
            }
        } else {
            this.doFail(ERecoErr.Upload, "--- 上传截图 失败, err:" + val.res)
        }
    }

    doSuccess(data) {
        gLog("--- doSuccess")
        let cb = this.mSuccessCb
        this.mSuccessCb = undefined
        this.mFailCb = undefined
        this.mIsRecoing = false
        this.mRecoCnt = 0
        clearInterval(this.mTimer)
        clearInterval(this.mShowTimer)

        if (cb) {
            cb(data)
        }
    }

    doFail(err, data) {
        gLog("--- doFail")
        let cb = this.mFailCb
        this.mSuccessCb = undefined
        this.mFailCb = undefined
        this.mIsRecoing = false
        this.mRecoCnt = 0
        clearInterval(this.mTimer)
        clearInterval(this.mShowTimer)

        if (cb) {
            cb(err, data)
        }
    }

    //--- wx相关接口转成 await promise 形式 begin ---
    async adapterWxUploadImage(url, filePath) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: url,
                filePath: filePath,
                name: 'image',
                success: res => { // 识别成功回调
                    resolve({ flag: true, res: res })
                },
                fail: err => {
                    resolve({ flag: false, res: err })
                }
            });
        })
    }

    async adapterWxTakePhoto(camCtx, quality) {
        return new Promise((resolve, reject) => {
            camCtx.takePhoto({
                quality: quality, // high, normal, low
                success: res => {
                    resolve({ flag: true, res: res })
                },
                fail: err => {
                    resolve({ flag: false, res: err })
                }
            });
        })
    }

    // TODO: 模拟的测试接口
    async adapterWxUploadImageFake(url, filePath) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ flag: false, res: "upload error" })
            }, 1000);
        })
    }
    async adapterWxTakePhotoFake(camCtx, quality) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ flag: false, res: "takePhoto error" })
            }, 1000);
        })
    }
    //--- wx相关接口转成 await promise 形式 end ---
}

export default ArMgr