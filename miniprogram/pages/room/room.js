const app = getApp()

Page({
  data: {
    SendUserInfo:null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: '',
    ForumCreatorOpenid: '',

    // functions for used in chatroom components
    onGetUserInfo:null,
    getOpenID: null,
  },


  onLoad: function(option) {
    // 传递帖子主题信息
    console.log('room页面加载')
    console.log(option)
    var ForumDeatailMsg = option;
    var ForumCreatorOpenid = option.ForumCreatorOpenid;
    
    
    this.setData({
      //页面数据初始化
      getOpenID: this.getOpenID,
      onGetUserInfo: this.onGetUserInfo,
      chatRoomSubject:  ForumDeatailMsg.Subject ,
      ForumCreatorOpenid:  ForumDeatailMsg.ForumCreatorOpenid,
      
      
    })
    console.log(ForumCreatorOpenid)
    // 获取设备参数
    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
    
  },


    //获取聊天发起者的openID
    getOpenID: async function() {
      if (this.openid) {
        return this.openid
      }

      const { result } = await wx.cloud.callFunction({
        name: 'login',
      })

      return result.openid
    },

    onGetUserInfo: function(e) {
      wx.navigateTo({
        url: '../login/login',
      })

    },

    onShareAppMessage() {
      return {
        title: '聊天记录',
        path: '/pages/im/room/room',
      }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (option) {
      ///SendUserInfo数据更新
      this.setData({
        SendUserInfo:wx.getStorageSync('userInfo')
      })
    },

})

