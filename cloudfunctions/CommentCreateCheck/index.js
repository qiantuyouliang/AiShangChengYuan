// 云函数入口文件
const cloud = require('wx-server-sdk')

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
  const ForumID = event.ForumID;
  const Author = event.Author;
  const ForumClassName = event.ForumClassName;
  const CommentContent = event.CommentContent;
  const tokenResponse= await got(TOKEN_URL);
  const tokenBody = JSON.parse(tokenResponse.body);
  const token = tokenBody.access_token;
  const wxContext = cloud.getWXContext();
  const OpenID = wxContext.OPENID;
  const CheckResponse = await request.post({
    uri: CHECK_URL + token,
    method: "post",
    body:{
      content:CommentContent
    },
    json: true
  });
  const errcode = CheckResponse.errcode;
  if (errcode == 0){
    const newAuthor = {
      nickName: Author.nickName,
      avatarUrl: Author.avatarUrl
    }
        //对评论进行数据库存储
        return await db.collection('Comments').add({
          data:{
            ForumClassName:ForumClassName,
            ForumID:ForumID,
            CommentContent:CommentContent,
            PubTime:db.serverDate(),  //入库时间
            Author:newAuthor,
            OpenID:OpenID,
          }
        })
      }else{
        return {"errcode":1,"errmsg":"您的内容有风险！ "}
      }

}