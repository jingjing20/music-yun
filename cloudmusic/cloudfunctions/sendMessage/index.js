// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      name1: {
        value: event.nickname
      },
      thing3: {
        value: event.content
      },
      time2: {
        value: event.createTime
      }
   },
   templateId: 'q-3UeuJvzjWTr6Ia2njG8GTpxvgle-vXIJrkkA4gY9Y',
   formId: event.formId
 })
 return result
}