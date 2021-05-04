//index.js
const app = getApp()
const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentData : 0,
      ForumClass:[1,2,2,2],
      ForumClassName: ['SecondHandForum','SquareForum','Sports','PhoneBook'],
      Forums:[],
      hasmore:true,
      clientHeight:'',
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
    console.log(app.globalData.screenHeight)
    this.setData({
      clientHeight :app.globalData.screenHeight
    })
  console.log('clientHeight高度'+ this.data.clientHeight)
  },
/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('显示的帖子板块是' + this.data.ForumClassName[this.data.currentData])
    console.log('ForumClass是'+this.data.ForumClass)
    this.setData({
     clientHeight:app.globalData.screenHeight
    })
    if(this.data.ForumClassName[this.data.currentData]!= 'PhoneBook'){
      this.LoadForum();
      console.log(this.data.Forums)
    }
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
  
  },

//页面滑动到底部
scrollbot:function(){

  this.LoadForum(this.data.Forums.length);   

  },

//当前页面发布内容  
onWriterForum:function(event){
  console.log('帖子的类别是'+this.data.ForumClass)
    wx.navigateTo({
      url: '../CreateForum/CreateForum?ForumClass='+this.data.ForumClass[this.data.currentData]+'&ForumClassName='+ this.data.ForumClassName[this.data.currentData],
    })

  },

//获取用户数据  
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

//获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    // that.setData({
    //   currentData: e.detail.current
    // })
  },

//点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;
    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    console.log('显示的板块切换到' + this.data.ForumClassName[this.data.currentData])
    if(this.data.ForumClassName[this.data.currentData]!= 'PhoneBook'){
      this.LoadForum();
    }
  },


//跳转到详情页
  onTaptoDetail:function(option){
    console.log(option)
    var tmp = option.currentTarget.dataset.id;
    var ForumContent =JSON.stringify(tmp.ForumContent);
    var _id = tmp._id;
    wx.navigateTo({
      url: '../ForumDetail/ForumDetail?Title=' + tmp.Title+'&ForumContent='+ ForumContent + '&Price=' +tmp.Price+ '&avatarUrl='+ tmp.Author.avatarUrl+'&nickName='+ tmp.Author.nickName+ '&PubTime='+ tmp.PubTime + '&ForumCreatorOpenid='+ tmp.OpenID+'&ForumId='+ _id+'&ForumClassName=SecondHandForum&ForumClass=1',
    })
  },

//帖子加载
  LoadForum:function(start=0){
    console.log('开始一次加载Forums')
    const that = this;
    const ForumClassName = this.data.ForumClassName[this.data.currentData];
    let promise = db.collection(ForumClassName);
    if(start > 0){
      promise = promise.skip(start);
      console.log('执行一次跳过历史Forums')
    }
     promise.limit(6).orderBy("PubTime","desc").get().then(res =>{
      const Forums = res.data;
      console.log('抽一次取Forum数据')
      console.log(Forums)

      Forums.forEach(item => {
        item.PubTime = app.TimeFormat(item.PubTime)
      });
      //假设还有数据

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
//拨打电话
  FreeCall:function(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phonenub,
    }); 
  },  

//时间格式化
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

})