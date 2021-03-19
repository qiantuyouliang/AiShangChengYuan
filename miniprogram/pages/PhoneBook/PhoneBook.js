// pages/PhoneBook/PhoneBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PhoneList:[
      {
        Name:"物业: ",
        PhoneNub:"4000669888",
      },
      {
        Name:"电工: ",
        PhoneNub:"13851870383",
      },
      {
        Name:"废品回收: ",
        PhoneNub:"13696589095",
      },      {
        Name:"自来水: ",
        PhoneNub:"02586121008",
      },      {
        Name:"燃气: ",
        PhoneNub:"02596889677",
      },      {
        Name:"开锁: ",
        PhoneNub:"13696589095",
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  FreeCall:function(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phonenub,
    });

      
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