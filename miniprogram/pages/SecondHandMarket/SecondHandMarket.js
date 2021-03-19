// miniprogram/pages/SecondHandMarket/SecondHandMarket.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore:true,
    Forums:[],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.LoadForum();
  },


  //加载帖子数据
  LoadForum:function(start=0){
    const that = this;
    let promise = db.collection("SecondHandForum");
    if(start > 0){
      promise = promise.skip(start);
    }
    promise.limit(6).orderBy("PubTime","desc").get().then(res =>{
      const Forums = res.data;
      let hasmore = true;
      if(Forums.length == 0){
        hasmore = false;
      }
      let NewForums = [];
      if(start > 0){
      NewForums = that.data.Forums.concat(Forums);
      }else{
        NewForums = Forums;
      }
      that.setData({
        Forums : NewForums,
        hasmore:hasmore
      });
    })
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (event) {
    this.LoadForum(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadForum(this.data.Forums.length);
  },

})