// pages/index/index.js

const regeneratorRuntime = require('../../src/libs/regenerator-runtime/runtime.js');


import { gLog } from '../../src/module/log/Logger.js';
import { ERecoErr } from '../../src/common/Enum.js';
import DebugMgr from '../../src/module/debug/DebugMgr.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 360
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    gLog("--- index onLoad")
    wx.getSystemInfo({
      success: res => {
        this.setData({ height: res.windowHeight });
      }
    });

    setTimeout(() => {
      // this.goRecognition()
    }, 100);

    // this.fn002()

  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    gLog("--- index onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    gLog("--- index onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // gLog("--- index onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    gLog("--- index onUnload")
  },

  fn001: function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("--- world")
      }, 3000);
    })
  },

  fn002: async function () {
    gLog("--- aaa 111")
    // let bbb = await this.fn001()
    let bbb = await DebugMgr.getIns().testFn001()
    gLog("--- bbb 111", bbb)
  },

  goShow: function (ev) {
    wx.navigateTo({
      url: '../web001/web001?key=value&key2=value2',
    });
  },

  goRecognition: function (ev) {
    wx.navigateTo({
      url: '../arcam/arcam'
      // url: '../recognition/recognition'
    });
  }
})