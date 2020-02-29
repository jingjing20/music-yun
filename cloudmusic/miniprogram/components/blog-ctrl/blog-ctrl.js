// components/blog-ctrl/blog-ctrl.js
// 数据库初始化
const db = wx.cloud.database()
let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    // 底部评论弹出层是否显示
    modalShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true
                })
              },
            })
          }else {
            this.setData({
              loginShow: true,
            })
          }
        },
      })
    },

    OnInput(event){
      this.setData({
        content: event.detail.value
      })
    },

    onLoginsuccess(event){
      userInfo = event.detail
      // 授权框消失 评论框显示
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    onLoginfail(){
      wx.showModal({
        title: '授权用户才能评论！'
      })
    },
    OnSend(event){
      // 数据插入云数据库
      let formId = event.detail.formId
      let content = this.data.content;
      // console.log(event)
      if(content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空！'
        })
        return
      }

      wx.showLoading({
        title: '评论中',
      })

      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickname: userInfo.nickname,
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功！',
        })

        this.setData({
          modalShow: false,
          content: '',
        })

        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList');
        

      })

      // 推送模板消息
      // wx.requestSubscribeMessage({
      //   tmplIds: ['q-3UeuJvzjWTr6Ia2njG8GTpxvgle-vXIJrkkA4gY9Y'],
      //   success: res => {
      //     wx.cloud.callFunction({
      //       name: 'sendMessage',
      //       data: {
      //         blogId: this.properties.blogId,
      //         nickname: userInfo.nickname,
      //         content,
      //         createTime: db.serverDate(),
      //         formId,
      //       }
      //     }).then((res) => {
      //       console.log(res)
      //     })
      //   }
      // })
    },
  }
})
