// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      // console.log(res)
      const jing = res.result.playlist
      this.setData({
        musiclist: jing.tracks,
        listInfo: {
          coverImgUrl: jing.coverImgUrl,
          name: jing.name,
        }
      })
      this._setMusiclist()
      wx.hideLoading();
    })
  },

_setMusiclist(){
  wx.setStorageSync('musiclist', this.data.musiclist)
}

})