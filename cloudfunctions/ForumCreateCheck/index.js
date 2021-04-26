// 云函数入口文件
const cloud = require("wx-server-sdk")

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database();
const got = require ("got");
const request =require("request-promise");
const { post } = require('request-promise');
const APPID = "wxe353608d10df73e5";
const APPSECRET = "1aa97985c0f110b341d4c0f6dc2d039a";
const TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APPID+"&secret="+APPSECRET;
const CHECK_URL = "https://api.weixin.qq.com/wxa/msg_sec_check?access_token="
// 云函数入口函数
exports.main = async (event, context) => {
  const Title = event.Title;
  const ForumContent = event.ForumContent;
  const Price = event.Price;
  const Author = event.Author;
  const ForumClassName = event.ForumClassName;
  const tokenResponse= await got(TOKEN_URL);
  const tokenBody = JSON.parse(tokenResponse.body);
  const token = tokenBody.access_token;
  const wxContext = cloud.getWXContext();
  const OpenID = wxContext.OPENID;

//内容的文字部分合并
  var contentReadytoCheck = '';
  var ImageList = [];
    for(var item of ForumContent ){
      if(item.ContentType ==1){
        contentReadytoCheck = contentReadytoCheck + item.Content;
      }else if(item.ContentType ==2){
        ImageList.push(item.Src);
      }
    } 


//合并后的内容发送检测
  const CheckResponse = await request.post({
    uri: CHECK_URL + token,
    method: "post",
    body:{
      content:contentReadytoCheck
    },
    json: true
  });
  const errcode = CheckResponse.errcode;
  if (errcode == 0){
    const newAuthor = {
      nickName: Author.nickName,
      avatarUrl: Author.avatarUrl
    }
    //文字链接信息进行数据库存储
    return await db.collection(ForumClassName).add({
      data:{
        Title:Title,
        ForumContent:ForumContent,
        ImageList:ImageList,
        Price:Price,
        PubTime:db.serverDate(),  //入库时间
        Author:newAuthor,
        OpenID:OpenID,
      }
    })
  }else{
    return {"errcode":1,"errmsg":"您的内容有风险！ "}
  }

  }