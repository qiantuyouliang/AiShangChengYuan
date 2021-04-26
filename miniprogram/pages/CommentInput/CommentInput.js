// miniprogram/pages/CommentInput/CommentInput.js
const app = getApp()
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
    this.setData({
      ForumId:options.ForumId,
      ForumClassName:options.ForumClassName
    })
    const screenWidth = (app.globalData.screenWidth-30)*2;
    console.log(screenWidth)

  },
  onCommentSubmit:function(event){
    console.log(event)
    const ForumClassName = this.data.ForumClassName;
    const ForumID = this.data.ForumId;
    const CommentContent = event.detail.value.CommentContent;
    const Author = wx.getStorageSync('userInfo');
    wx.showLoading({
      title: '正在发布中...',
    });
    //检查是否有文字
    if(!CommentContent){
      wx.showToast({
        title: '请输入评论！',
        icon: 'error',
        duration: 1500
      });
    
    }else{
      const Comment = {
        ForumClassName:ForumClassName,
        ForumID:ForumID,
        Author:Author,
        CommentContent:CommentContent
        }
      wx.cloud.callFunction({
        name:"CommentCreateCheck",
        data:Comment,
        success:res =>{
          const _id = res.result._id;
          if(_id){
            wx.hideLoading();
            wx.showToast({
              title: '发布成功！',
              icon: 'success',
              duration: 1800
            });
            setTimeout(function(){
              wx.navigateBack({
                delta: 1,
              })
            },1000)
          }
        }
       })
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

  }
})