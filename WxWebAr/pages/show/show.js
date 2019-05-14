// pages/show/show.js

import { gLog } from '../../src/module/log/Logger.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    gLog("--- show onLoad")

    // setTimeout(() => {
    //   wx.navigateTo({
    //     url: '../show222/show222'
    //   });
    // }, 3000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    gLog("--- show onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    gLog("--- show onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    gLog("--- show onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    gLog("--- show onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    gLog("--- show onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    gLog("--- show onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    gLog("--- show onShareAppMessage")
  }
})