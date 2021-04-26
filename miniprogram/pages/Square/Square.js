// pages/Square/Square.js
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
  },


/**
   * 发帖事件
   */
  onWriterForum:function(event){
    wx.navigateTo({
      url: '../CreateForum/CreateForum?ForumClass=2&ForumClassName=SquareForum',
    })

  },
/**
   * 搜索事件--导航到搜索页面
   */
  OnSearchEvent:function(event){
    
    wx.navigateTo({
      url:  '../search/search?SearchCollection='+ event.target.dataset.collection,
    })
    console.log(event)
  },

/**
   * 加载帖子数据
   */
  LoadForum:function(start=0){
    const that = this;
    let promise = db.collection("SquareForum");
    if(start > 0){
      promise = promise.skip(start);
    }
    promise.limit(6).orderBy("PubTime","desc").get().then(res =>{
      const Forums = res.data;
      console.log(Forums)
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
      NewForums.forEach(avatarUrl => {
  
});

      that.setData({
        Forums : NewForums,
        hasmore: hasmore
      });
    })

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.LoadForum(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadForum(this.data.Forums.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})