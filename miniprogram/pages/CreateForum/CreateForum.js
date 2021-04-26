// miniprogram/pages/CreateForum/CreateForum.js
import { getUUID,getExt} from "../../utils/utils"
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ForumContent:[{id:0,ContentType:1}],
    TempImages:[],
    ForumClass:'',
    ForumClassName:'',
  },

/**
   * 查看是否需要鉴权
   */
  onLoad: function (event) {
    console.log(event)
    this.setData({
          ForumClass:event.ForumClass,  
      ForumClassName:event.ForumClassName, 
    })
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo == ''){
     wx.navigateTo({
       url: '../login/login',
     })
     
    }

  },


  OnSubmitEventPaper:function(Option){

    //取出文字数组
    var TxtContent = Option.detail.value 
    var ForumContent = this.data.ForumContent;
    const Price = TxtContent.Price;
    const Title = TxtContent.Title;
    const ForumClassName = this.data.ForumClassName;
    const Author = wx.getStorageSync('userInfo') ;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth()+1;
    const day = today.getDate();
    wx.showLoading({
      title: '正在发布中...',
    });
    var that= this;
//文字数组与图片数组合并成要存储的数组
    const MergeArray = async function(ForumContent){
      for(var key in ForumContent){
        console.log('开始执行合并')
        if(ForumContent[key].ContentType==1){
          ForumContent[key].Content = TxtContent[key];
          console.log('执行了一次文字合并')
        }else if(ForumContent[key].ContentType==2){
          await wx.cloud.uploadFile({
            filePath: ForumContent[key].Src[0],
            cloudPath: ForumClassName+"/"+year+"/"+month+"/"+day+"/"+getUUID()+"."+getExt(ForumContent[key].Src[0]),
              }).then(res =>{
                    ForumContent[key].Src= res.fileID
                    console.log('执行了一次图片合并')
                  }).catch(error =>{
                    console.error();
                      })
              }
           }
        console.log('所有合并都已完成')
        if(Title ==''){
          wx.showToast({
            title: '请输入标题',
            icon: 'error',
            duration: 1500
          });
         }
        const Forum = {
          Title:Title,
          Author:Author,
          Price:Price,
          ForumContent:ForumContent,
          ForumClassName:ForumClassName};
          console.log(Forum)
        that.PublicForumTxt(Forum); 
        }
     MergeArray(ForumContent); //函数异步执行有点问题

    },


    

//文字审核及发布
    PublicForumTxt:function(Forum){
        //云函数文字内容检测
          wx.cloud.callFunction({
          name:"ForumCreateCheck",
          data:Forum,
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
                else{
                  wx.showToast({
                    title: res.result.errmsg,
                    icon: 'error',
                    duration: 2800
                  })
                }
              }
        })
        },


//ForumClass=1 时添加图片函数
  OnAddImageTap:function(){
    const that = this;
    wx.chooseImage({
      success:function(res){
        const TempImages = res.tempFilePaths;
        const OldImages = that.data.TempImages;
        const NewImages = OldImages.concat(TempImages)
        that.setData({
          TempImages :NewImages       
        })
      },
    })
  },

//ForumClass=1 时删除图片函数 
  OnRemoveImages:function(event){
    const index = event.target.dataset.index;
    const TempImages = this.data.TempImages;
    TempImages.splice(index,1);
    this.setData({
      TempImages : TempImages
    });
  },

//ForumClass=2 时添加图片函数
    OnAddImageTap2:function(e){
      const that = this
      var ForumContent = this.data.ForumContent;
      let InsertId = e.currentTarget.dataset.idx
      wx.chooseImage({
        success:function(res){
          const TempImages = res.tempFilePaths;
          console.log(res)
          var newData = { id:ForumContent.length,ContentType:2,Src:res.tempFilePaths};
          ForumContent.splice(InsertId+1 ,0, newData);
          that.setData({
            ForumContent:ForumContent,
          })

        },
      })
    },
  
//ForumClass=2 时添加文字框函数
  OnAddTextTap2:function(event){
    var ForumContent = this.data.ForumContent;
    let InsertId = event.currentTarget.dataset.idx
    var newData = { id:ForumContent.length,ContentType:1};
    ForumContent.splice(InsertId+1 ,0, newData);
    this.setData({
      ForumContent:ForumContent,
    })
  }
})