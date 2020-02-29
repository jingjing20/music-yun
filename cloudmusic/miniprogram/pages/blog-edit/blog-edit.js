// 最大文字输入个数
const MAX_WORD_SIZE = 140
// 最大图片数量
const MAX_IMG_NUM = 9
const db = wx.cloud.database()
// 输入的文字内容
let content = ''

let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WordsNum: 0,
    footerBottom: 0,
    images: [],
    selectphoto: true,  //当前选择图片元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // onLoad函数初始数据就有用户信息
    console.log(options)
    userInfo = options
  },

  onInput(event) {
    // console.log(event.detail.value)
    let WordsNum = event.detail.value.length
    if(WordsNum >= MAX_WORD_SIZE) {
      WordsNum = `最大字数为${WordsNum}`
    }
    this.setData({
      WordsNum
    })
    content = event.detail.value
  },

  onFocus(event){
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur(){
    this.setData({
      footerBottom: 0,
    })
  },

  OnchangeImage(){
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['compressed','original'],
      sourceType: ['album','camera'],
      success: (res) => {
        // console.log(res)
        this.setData({
          images:this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectphoto: max <= 0 ? false : true
        })
      },
    })
  },

  onDelImage(event){
    // console.log(event.target.dataset.jing)
    this.data.images.splice(event.target.dataset.jing,1)
    this.setData({
      images:this.data.images
    })
    if(this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectphoto: true
      })
    }
  },

  onPreviewImage(event){
    wx.previewImage({
      urls: this.data.images,
      current:event.target.dataset.imgsrc
    })
  },

  send(){
    // 用户发布博客数据存入云数据库
    // 数据库：文字内容、图片fileId、openId、昵称、头像、发布时间
    // 图片：云存储 fileId 云文件ID

    // 判断输入内容是否为空
    if(content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    // 提示信息
    wx.showLoading({
      title: '发布中',
      mask: true
    })

    let fileIds = []
    let promiseArr = []
    // 图片上传
    var len = this.data.images.length
    for(let i = 0; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    // 存入到云数据库
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          content,
          img: fileIds,
          ...userInfo,
          createTime: db.serverDate(),
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        // 返回发布界面
        wx.navigateBack()
        const pages = getCurrentPages()
        // 取到上一个页面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})