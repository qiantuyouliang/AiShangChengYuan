const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    SendUserInfo:null,//对方的信息
    RecieveUserInfo: null, //接收者的信息
    ChatGroupName:'',
    takeSession: false,
    requestResult: '',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: '',
    ForumCreatorOpenid: '',
    screenHeight:'',
    Messages:null,

    // functions for used in chatroom components
    onGetUserInfo:null,
    getOpenID: null,
  },


  onLoad: async function(option) {
    // 传递帖子主题信息
    console.log('room页面开始加载')
    //获取发送者的信息
    var SendUserInfo = option;
    SendUserInfo.openid= 'oi9K-4oyfy46y4jHKd5-o8Uxl3mA';

    //获取接收者的信息
    var RecieveUserInfo = wx.getStorageSync('userInfo');
    if(!RecieveUserInfo){
      console.log('RecieveUserInfo 内没有数据')
      this.onGetUserInfo();
        }
    RecieveUserInfo.openid = await this.getOpenID();
    if(RecieveUserInfo.openid==SendUserInfo.openid){
      wx.showToast({
        title: '不能和自己聊天',
      });
      wx.navigateBack({
        delta: 0,
      })
    }
    //获取消息组的名称
    var ChatGroupName = (RecieveUserInfo.openid > SendUserInfo.openid? RecieveUserInfo.openid+SendUserInfo.openid: SendUserInfo.openid+RecieveUserInfo.openid)
    console.log('合并后的消息组名称是'+ChatGroupName)
    this.setData({
        //页面数据初始化
        screenHeight:(app.globalData.screenHeight*2-88),
        RecieveUserInfo:RecieveUserInfo,
        SendUserInfo:SendUserInfo,
        getOpenID: this.getOpenID, //getOpenID函数初始化
        onGetUserInfo: this.onGetUserInfo, //onGetUserInfo函数初始化
        ChatGroupName:ChatGroupName,
     })
     console.log(this.data.ChatGroupName)
//历史消息初始化
     await this.LoadMessage();
     console.log(this.data.Messages)
    //    this.initWatch()
   
    
  },

  //获取消息接收者的openID
  getOpenID: async function() {
    console.log('获取消息接收者的openID')
    if (this.openid) {
      return this.openid
    }
    const { result } = await wx.cloud.callFunction({
      name: 'login',
    })
    return result.openid
  },

 //获取消息接收者的个人信息
  onGetUserInfo: function(e) {
    console.log('获取消息接收者的个人信息')
    wx.navigateTo({
      url: '../login/login',
    })
  },

//加载消息
  LoadMessage:async function(start=0){
    const that = this;
    const ChatGroupName = this.data.ChatGroupName
    let promise = db.collection("ChatMessage");
    if(start > 0){
      promise = promise.skip(start);
    }
   await promise.limit(10).where({ChatGroupName:ChatGroupName}).orderBy("PubTime","desc").get().then(res =>{
      const Messages = res.data;
      
      let hasmore = true;
      if(Messages.length == 0){
        hasmore = false;
      }
      let NewMessages = [];
      if(start > 0){
        NewMessages = that.data.Messages.concat(Messages);
      }else{
        NewMessages = Messages;
      }
      NewMessages.forEach(item => {
        item.sendTime = app.TimeFormat(item.sendTime)
      });

      this.setData({
        Messages : NewMessages,
        hasmore: hasmore
      });
    })
  },
  
//监听云数据库
   initWatch:function(criteria){
    console.log('监听聊天数据库更新');
    try{
      const collection = 'ChatMessage';
      const _= wx.cloud.database.command;
      console.warn(`开始监听`, criteria)
      this.messageListener = db.collection(collection).where({
        ChatGroupName: this.onRealtimeMessageSnapshot.bind(this),
        // onChange: this.onRealtimeMessageSnapshot.bind(this),
          onError: e => {
            if (!this.inited || this.fatalRebuildCount >= FATAL_REBUILD_TOLERANCE) {
              this.showError(this.inited ? '监听错误，已断开' : '初始化监听失败', e, '重连', () => {
                this.initWatch(this.data.chats.length ? {
                  sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
                } : {})
              })
            } else {
              this.initWatch(this.data.chats.length ? {
                sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
              } : {})
            }
          },
      })
    }catch(err){
      console.log(err)
    }
},



//消息数据库更新事件
  onRealtimeMessageSnapshot:function(snapshot) {
    console.warn(`收到消息`, snapshot)

    if (snapshot.type === 'init') {
      this.setData({
        chats: [
          ...this.data.chats,
          ...[...snapshot.docs].sort((x, y) => x.sendTimeTS - y.sendTimeTS),
        ],
      })
      this.scrollToBottom()
      this.inited = true
    } else {
      let hasNewMessage = false
      let hasOthersMessage = false
      const chats = [...this.data.chats]
      for (const docChange of snapshot.docChanges) {
        switch (docChange.queueType) {
          case 'enqueue': {
            hasOthersMessage = docChange.doc._FirstOpenId !== this.data.FirstOpenId
            const ind = chats.findIndex(chat => chat._id === docChange.doc._id)
            if (ind > -1) {
              if (chats[ind].msgType === 'image' && chats[ind].tempFilePath) {
                chats.splice(ind, 1, {
                  ...docChange.doc,
                  tempFilePath: chats[ind].tempFilePath,
                })
              } else chats.splice(ind, 1, docChange.doc)
            } else {
              hasNewMessage = true
              chats.push(docChange.doc)
            }
            break
          }
        }
      }
      this.setData({
        chats: chats.sort((x, y) => x.sendTimeTS - y.sendTimeTS),
      })
      if (hasOthersMessage || hasNewMessage) {
        this.scrollToBottom()
      }
    }
  },

//文字消息发送
  async onConfirmSendText(e) {
      if (!e.detail.value) {
        console.log('发送文字失败')
        return
      }
      const _= wx.cloud.database.command
      const doc = {
        _id: `${Math.random()}_${Date.now()}`,
        ChatGroupName: this.data.ChatGroupName,        //标记会话双方
        Sendopenid: this.data.RecieveUserInfo.openid,
        SendAvatar: this.data.RecieveUserInfo.avatarUrl,
        SendNickName:  this.data.RecieveUserInfo.nickName,
        msgType: 'text',
        textContent: e.detail.value,
        sendTime: new Date(),
        sendTimeTS: Date.now(), // fallback
      }

      // this.scrollToBottom(true)
      console.log('开始将文字包装')
      await db.collection('ChatMessage').add({
        data: doc,
      })
      console.log('消息存储完成')

},

    //发送图片
  async onChooseImage(e) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: async res => {
        const { envId, collection } = this.properties
        const doc = {
          _id: `${Math.random()}_${Date.now()}`,
          chatRoomSubject: this.data.chatRoomSubject,
          avatar: this.data.userInfo.avatarUrl,
          nickName: this.data.userInfo.nickName,
          msgType: 'image',
          sendTime: new Date(),
          sendTimeTS: Date.now(), // fallback
        }

        this.setData({
          chats: [
            ...this.data.chats,
            {
              ...doc,
              _FirstOpenId: this.data.FirstOpenId,
              tempFilePath: res.tempFilePaths[0],
              writeStatus: 0,
            },
          ]
        })
        this.scrollToBottom(true)

        const uploadTask = wx.cloud.uploadFile({
          cloudPath: `${this.data.FirstOpenId}/${Math.random()}_${Date.now()}.${res.tempFilePaths[0].match(/\.(\w+)$/)[1]}`,
          filePath: res.tempFilePaths[0],
          config: {
            env: envId,
          },
          success: res => {
            this.try(async () => {
              await this.db.collection(collection).add({
                data: {
                  ...doc,
                  imgFileID: res.fileID,
                },
              })
            }, '发送图片失败')
          },
          fail: e => {
            this.showError('发送图片失败', e)
          },
        })

        uploadTask.onProgressUpdate(({ progress }) => {
          this.setData({
            chats: this.data.chats.map(chat => {
              if (chat._id === doc._id) {
                return {
                  ...chat,
                  writeStatus: progress,
                }
              } else return chat
            })
          })
        })
      },
    })
  },

//图片预览 
  onMessageImageTap(e) {
    wx.previewImage({
      urls: [e.target.dataset.fileid],
    })
  },

//窗口滑动到底部
  scrollToBottom(force) {
    if (force) {
      console.log('force scroll to bottom')
      this.setData(SETDATA_SCROLL_TO_BOTTOM)
      return
    }

    this.createSelectorQuery().select('.body').boundingClientRect(bodyRect => {
      this.createSelectorQuery().select(`.body`).scrollOffset(scroll => {
        if (scroll.scrollTop + bodyRect.height * 3 > scroll.scrollHeight) {
          console.log('should scroll to bottom')
          this.setData(SETDATA_SCROLL_TO_BOTTOM)
        }
      }).exec()
    }).exec()
  },

//窗口滑动到顶部
  async onScrollToUpper() {
    if (this.db && this.data.chats.length) {
      const { collection } = this.properties
      const _ = this.db.command
      const { data } = await this.db.collection(collection).where(this.mergeCommonCriteria({
        sendTimeTS: _.lt(this.data.chats[0].sendTimeTS),
      })).orderBy('sendTimeTS', 'desc').get()
      this.data.chats.unshift(...data.reverse())
      this.setData({
        chats: this.data.chats,
        scrollToMessage: `item-${data.length}`,
        scrollWithAnimation: false,
      })
    }
  },


    onShareAppMessage() {
      return {
        title: '聊天记录',
        path: '/pages/im/room/room',
      }
    },

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function (option) {
      ///RecieveUserInfo数据更新
      this.setData({
        RecieveUserInfo:wx.getStorageSync('userInfo')
      })
    },

})

