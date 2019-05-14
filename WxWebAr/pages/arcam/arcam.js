// pages/show/show.js

import { gLog } from '../../src/module/log/Logger.js';
import ArMgr from '../../src/module/ar/ArMgr.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 800,
    isLoadingShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    gLog("--- arcam onLoad")

    ArMgr.getIns().OnCamViewLoad(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    gLog("--- arcam onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    gLog("--- arcam onShow")

    ArMgr.getIns().StartReco({
      success: (res) => {
        this.setData({ isLoadingShow: false });
        gLog("--- 成功喽 arcam res:", res)
        wx.redirectTo({
          url: '../web001/web001?name=' + res
        });
      },
      fail: (errCode, msg) => {
        this.setData({ isLoadingShow: false });
        this.recoFailTips()
        gLog("--- 失败喽 arcam errCode:", errCode, msg)
      },
    })
    ArMgr.getIns().OnCamViewShow()

    this.setData({ 
      isLoadingShow: false, 
    });

    // loading 晚点出来体验会好一点
    setTimeout(() => {
      this.setData({ 
        isLoadingShow: true, 
      });
    }, 900);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    gLog("--- arcam onHide")
    ArMgr.getIns().OnCamViewHide()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    gLog("--- arcam onUnload")
    ArMgr.getIns().OnCamViewUnload()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    gLog("--- arcam onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    gLog("--- arcam onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    gLog("--- arcam onShareAppMessage")
  },

  recoFailTips: function() {
    wx.showModal({
      title: '识别失败',
      content: '请将摄像头对准目标',
      cancelText: '返回',
      confirmText: '再次识别',
      success: (res) => {
        if (res.confirm) {
          this.onShow()
        } else {
          wx.navigateBack({ delta: 1 })
        }
      }
    })
  }
})