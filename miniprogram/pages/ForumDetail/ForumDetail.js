// pages/SecondHandDetail/SecondHandDetail.js
const app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore:true,
    Comments:[],
    Forum:[],
    ForumContent: [],
    ForumId:'',
    ForumClassName:'',
    ForumClass:'',
    userInfo:{},
    Forum:[]
  },

/**
   * 生命周期函数--页面加载详细信息
   */
  onLoad:function (options){
    const userInfo = wx.getStorageSync('userInfo');
    const ForumContent =JSON.parse(options.ForumContent);
    var Forum = options;
       this.setData({
        ForumContent : ForumContent ,
      ForumClassName : options.ForumClassName,
          ForumClass : options.ForumClass,
             ForumId : options.ForumId,
               Forum : Forum,
            userInfo : userInfo
        }) ;
   },

/**
   * 生命周期函数--监听页面显示
   */
  onShow:async  function (option) {

    await this.LoadComment();
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

  },

/**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


//点赞
   onPraiseTap:function(event){
     console.log(event)
   },

//评论输入
   onCommentInput:function(option){
     wx.navigateTo({
       url: '../CommentInput/CommentInput?ForumId='+this.data.ForumId+ '&ForumClassName=' + this.data.ForumClassName,
     })
   },

// 加载评论
   LoadComment:async function(start=0){
    const _ = db.command  
    let promise = db.collection('Comments');
    if (start >0){
      promise = promise.skip(start);
    }
    await promise.limit(8).where({
      ForumClassName:this.data.ForumClassName,
      ForumID:this.data.ForumId}).orderBy("PubTime","desc").get().then(res =>{
      const Comments = res.data;
      Comments.forEach(item =>{
        item.PubTime = app.TimeFormat(item.PubTime)
      });
      let hasmore = true;
      if (Comments.length==0){
        hasmore = false;
      }
      let NewComments= [];
      if(start > 0){
        NewComments= that.data.Comments.concat(Comments);
      }else{
        NewComments = Comments;
      }
      this.setData({
        Comments:NewComments,
        hasmore:hasmore
      })
    })
    console.log(this.data.Comments.length)
   },
})