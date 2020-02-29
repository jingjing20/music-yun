// pages/find/find.js
//搜索关键字
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示底部弹出框
    modalShow: false,
    blogList: []
  },

  // 发布功能
  onPublish(){
    // this.setData({
    //   modalShow: true
    // })

    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if(res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              // console.log(res)
              this.onLoginSuccess({
                detail:res.userInfo
              })
            },
          })
        }else {
          this.setData({
            modalShow:true
          })
        }
      },
    })
  },

  onLoginSuccess(event){
    console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail(){
    wx.showModal({
      title:'授权用户才能发布',
      content:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  onSerach(event){
    // console.log(event)
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    // console.log(keyword)
    this._loadBlogList(0) 
  },


  _loadBlogList(start = 0){
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        $url: 'list',
        count: 10,
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })
  },

  goComment(event) {
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
    })
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
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event);
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`
      // imageUrl
    }
  }
})