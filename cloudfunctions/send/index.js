// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    await db.collection('chat').add({
      data:{
        goodID: event.goodID,
        speaker: event.speaker,
        listenner: event.listenner,
        content: event.content,
        time: event.time,
        hasRead: event.hasRead,
        speakerName: event.speakerName,
        listennerName: event.listennerName,
        imageCloudPath: event.imageCloudPath,
        goodName: event.goodName
      }
    })
    return 'true'
  }
  catch(e){
    console.log(e)
  }
}
