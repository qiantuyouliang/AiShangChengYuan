// pages/search/search.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SearchCollection:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      SearchCollection : options.SearchCollection,
    })
    
  },


  OnSearchEvent:function(event){
    let SearchCollection = this.data.SearchCollection
    var SearchValue = event.detail.value;
    var that = this;
    console.log(SearchCollection);
    db.collection(SearchCollection).where({
      //正则模糊查询
      Title:db.RegExp({
        regexp:SearchValue,
        options:'i',
      })
    }).orderBy("PubTime","desc").get({
      success:res =>{
        console.log(res);
        res.data.forEach(item => {
          item.PubTime = this.TimeFormat(item.PubTime)
        })
        that.setData({
          searchResult:res.data
        })
      }      
    })
    
  },
  //时间格式化函数
  TimeFormat:function(options){
    var date = options;
    this.setData({
      date:date
    })
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