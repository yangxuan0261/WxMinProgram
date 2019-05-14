import { gLog } from '../../src/module/log/Logger.js';
import Config from '../../src/common/Config.js';

Page({

  data: {
    myWebUrl: ""
  },

  onLoad: function (args) {
    gLog("--- web001 onLoad args:", args)
    
    let toWebArgs = {
      arg1: "hello",
      arg2: 1234,
    }
    let url = `${Config.webUrl}?name=${args.name}&arg1=${toWebArgs.arg1}&arg2=${toWebArgs.arg2}`
    this.setData({ myWebUrl: url }); // 动态设置 url
  },

  onReady: function () {
    gLog("--- web001 onReady")
  },

  onShow: function () {
    gLog("--- web001 onShow")
  },

  onHide: function () {
    gLog("--- web001 onHide")
  },

  onUnload: function () {
    gLog("--- web001 onUnload")
  },

  onPullDownRefresh: function () {
    gLog("--- web001 onPullDownRefresh")
  },


  onReachBottom: function () {
    gLog("--- web001 onReachBottom")
  },

  /**
   * 用户分享时可获取当前<web-view/>的URL，即在onShareAppMessage回调中返回webViewUrl参数。  console.log(options.webViewUrl)
   */
  onShareAppMessage: function (options) {
    gLog("--- web001 onShareAppMessage, options:", options)
  },

  // 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
  msgHandler: function(args) {
    // gLog("--- web001 msgHandler", args)
    gLog("--- web001 msgHandler", args.detail)
  },
})