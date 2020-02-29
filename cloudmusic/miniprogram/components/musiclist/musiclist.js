// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId : -1
  },

  pageLifetimes: {
    show(){
      this.setData({
        playingId: parseInt(app.getPlayMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    SelectOn(event) {
      const hao = event.currentTarget.dataset;
      const musicid = hao.musicid;
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/playing/playing?musicId=${musicid}&index=${hao.index}`,
      })
    }
  }
})
