let Config = {
    // ar识别 相关设置
    imgUrl: "http://192.168.1.190/webar/recognize.php", // 上传路径
    quality: "normal", // 截图质量
    recoCnt: 3, // 识别次数
    scanTime: 1500, // 识别周期
    resumeTime: 1500, // 唤醒后几秒后开始识别

    // 网页 相关设置
    webUrl: "http://192.168.1.190/SimpleThreeJsExample/index-wx.html", // 展示模型页面
}

export default Config