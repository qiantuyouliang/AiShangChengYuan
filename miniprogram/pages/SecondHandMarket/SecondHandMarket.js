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
   *  帖子检索
   */
 
  OnSearchEvent:function(event){
    wx.navigateTo({
      url: '../search/search?SearchCollection='+ event.target.dataset.collection,
  
    })
    
  },

  onTaptoDetail:function(option){

    var tmp = option.currentTarget.dataset.item;
    var ForumContent =JSON.stringify(tmp.ForumContent);
    var _id = tmp._id;
    wx.navigateTo({
      url: '../ForumDetail/ForumDetail?Title=' + tmp.Title+'&ForumContent='+ ForumContent + '&Price=' +tmp.Price+ '&avatarUrl='+ tmp.Author.avatarUrl+'&nickName='+ tmp.Author.nickName+ '&PubTime='+ tmp.PubTime + '&ForumCreatorOpenid='+ tmp.OpenID+'&ForumId='+ _id+'&ForumClassName=SecondHandForum&ForumClass=1',
    })
  },

/**
   * 加载帖子数据
   */
  LoadForum:function(start=0){
    const that = this;
    let promise = db.collection("SecondHandForum");
    if(start > 0){
      promise = promise.skip(start);
      }
      promise.limit(6).orderBy("PubTime","desc").get().then(res =>{
      const Forums = res.data;
      
      Forums.forEach(item => {
        item.PubTime = app.TimeFormat(item.PubTime)
      });
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
        hasmore: hasmore
      });

    })
    
  },

  /**
   * 发布帖子
   */
  onWriterForum:function(event){
    wx.navigateTo({
      url: '../CreateForum/CreateForum?ForumClass=1&ForumClassName=SecondHandForum',
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