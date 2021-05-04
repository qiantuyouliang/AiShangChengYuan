//app.js
App({
  

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          this.globalData.screenHeight = res.screenHeight
          this.globalData.screenWidth = res.screenWidth
          this.globalData.statusBarHeight = res.statusBarHeight
          this.globalData.navBarHeight = 44 + res.statusBarHeight
        }
    })

    //用户授权初始化
    this.SetUserInfo();
  },
  globalData:
  {  statusBarHeight: 0,
    screenHeight: 0  },


  //时间格式化函数
  TimeFormat:function(options){
    var that = this
    var date = options;
    console.log(date)
    var date_seconds = date.getTime()/1000;
    var now = new Date();
    var now_seconds = now.getTime()/1000;
    var TimeStamp = now_seconds - date_seconds;
    var TimeStr = "";
    if(TimeStamp<60){
      TimeStr = "刚刚";
    }else if(TimeStamp >=60 && TimeStamp <60*60){
      var minutes = parseInt(TimeStamp/60);
      TimeStr = minutes + "分钟前";
    }else if(TimeStamp>=60*60&&TimeStamp<60*60*24){
      var hours = parseInt(TimeStamp/60/60);
      TimeStr = hours + "小时前";
    }else if(TimeStamp >= 60*60*24 && TimeStamp<60*60*24*30){
      var days = parseInt(TimeStamp/60/60/24);
      TimeStr = days + "天前";
    }else{
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      TimeStr = year + "/" + month + "/" +day +"/" + hour +"/"+ minute + "/"
    }
    return TimeStr
  },


//给与用户授权
  SetUserInfo:function(userInfo){
    this.globalData.userInfo = wx.getStorageSync('userInfo') ;
  }
})
