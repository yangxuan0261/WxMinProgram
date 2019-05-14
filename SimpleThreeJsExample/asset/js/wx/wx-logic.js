console.log("--- wx-logic ok")

document.querySelector('#redirect').addEventListener('click', () => {
	wx.miniProgram.redirectTo({
		url: '../index/index'
	  })
	// wx.miniProgram.navigateBack({
	// 	delta: 1
	// })

}, false);

// 获取网络参数
function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) {
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
		} 
	} 
	return theRequest; 
} 
 
var args = GetRequest(); 
console.log("--- args", args)

args.webData = "world" // 随便增加点web的数据

// 向小程序发送信息
wx.miniProgram.getEnv(function (res) {
	console.log(res.miniprogram) // true
	if (res.miniprogram) {
		// alert("--- res.miniprogram:" + res.miniprogram)
		wx.miniProgram.postMessage({ data: args })
	} else {
		alert("just support wx")
	}
})

// TODO: 直接显示模型
const threeHelper22 = new ThreeHelper();
// threeHelper22.loadObject('asset/model/role_jiqiren.FBX');
// threeHelper22.loadObject('asset/model/role_chushi.FBX');
threeHelper22.loadObject(`asset/model/${RecoConfig[args.name]}`);
alert("--- 加载模型: name:" + args.name)

