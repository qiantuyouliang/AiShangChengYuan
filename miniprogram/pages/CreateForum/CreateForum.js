// miniprogram/pages/CreateForum/CreateForum.js
import { getUUID,getExt} from "../../utils/utils"
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TempImages:[]
  },

/**
   * 查看是否需要鉴权
   */
  onLoad: function () {
    if(app.is_login()){
      wx.switchTab({
        url: '../CreateForum/CreateForum',
      })
    }else{
     wx.navigateTo({
       url: '../login/login',
     })
    }
    this.initImageSize();

  },




  initImageSize:function(){
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const containerWidth = windowWidth -30;
    const imageSize = (containerWidth - 9*3)/3;
    this.setData({
      imageSize:imageSize
    });  
  },

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
  OnRemoveImages:function(event){
    const index = event.target.dataset.index;
    const TempImages = this.data.TempImages;
    TempImages.splice(index,1);
    this.setData({
      TempImages : TempImages
    });
  },

  OnSubmitEvent:function(event){
    const that = this;
    const Title = event.detail.value.Title;
    const Price = event.detail.value.Price;
    const Content = event.detail.value.Content;
    const Author = app.globalData.userInfo;
    
    wx.showLoading({
      title: '正在发布中...',
    });
    //图片检查并上传
    if(that.data.TempImages.length > 0){
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth()+1;
      const day = today.getDate();
      const Forum = {
        Title:Title,
        Price:Price,
        Author:Author,
        Content :Content
      }
      const fileIdList=[];
      that.data.TempImages.forEach((value,index) => {
        wx.cloud.uploadFile({
          filePath:value,
          cloudPath:"SecondHandForum/"+year+"/"+month+"/"+day+"/"+getUUID()+"."+getExt(value),
          success:res =>{
            fileIdList.push(res.fileID);
            if(fileIdList.length == that.data.TempImages.length){
              //进行帖子的文字审核及发布
                Forum.images = fileIdList;
                that.PublicForumTxt(Forum);
          }
        }
      });
      })
    }else{
      wx.showToast({
        title: '请插入图片！',
        icon: 'error',
        duration: 1500
      });
     }
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
              wx.switchTab({
                url: '../../pages/index/index',
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

  //图片预览实现
  OnImagePreview:function(event){
    const that = this;
    const index = event.target.dataset.index;
    const current = that.data.TempImages[index];
    wx.previewImage({
      urls: that.data.TempImages,
      current:current
    })
  }

})