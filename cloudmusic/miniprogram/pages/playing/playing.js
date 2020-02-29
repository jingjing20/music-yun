// pages/playing/playing.js
let musiclist = []
    //正在播放歌曲的index
let nowPlayingIndex = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picUrl: '',
        isPlaying: false,
        isLyricShow: false,
        lyric: [],
        isSame: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        nowPlayingIndex = options.index                 //获取单击音乐列表的索引
        musiclist = wx.getStorageSync('musiclist')      //取出歌单信息
        this._loadMusicDetail(options.musicId)          // 获取歌曲详细信息
    },

    // 获取歌曲详细信息函数
    _loadMusicDetail(musicId) {
        if(musicId == app.getPlayMusicId()) {
            this.setData({
                isSame:true
            })
        }else {
            this.setData({
                isSame: false
            })
        }
        if(!this.data.isSame) {
            backgroundAudioManager.stop();
        } 
        let music = musiclist[nowPlayingIndex] //根据索引找到音乐信息
        console.log(music)
        wx.setNavigationBarTitle({ //设置标题名
            title: music.name,
        })

        app.setPlayMusicId(musicId)

        this.setData({
            picUrl: music.al.picUrl, //设置背景图片
            isPlaying: false
        })
        wx.showLoading({
            title: '音乐加载中',
        })
        wx.cloud.callFunction({
            name: 'music',
            data: {
                musicId,
                $url: 'musicUrl',
            }
        }).then((res) => {
            console.log(res)
            console.log(JSON.parse(res.result))
            let result = JSON.parse(res.result)
            if(result.data[0].url == null) {
                wx.showToast({
                  title: '无权限播放',
                })
                return
            }
            if(!this.data.isSame) {
                backgroundAudioManager.src = result.data[0].url
                backgroundAudioManager.title = music.name
                backgroundAudioManager.coverImgUrl = music.al.picUrl
                backgroundAudioManager.singer = music.ar[0].name

                // 保存播放历史
                this.savePlayHistory()
            }
            
            this.setData({
                isPlaying: true
            })
            wx.hideLoading()
                //加载歌词
            wx.cloud.callFunction({
                name: 'music',
                data: {
                    musicId,
                    $url: 'lyric',
                }
            }).then(res => {
                console.log(res)
                let lyric = '暂无歌词'
                const lrc = JSON.parse(res.result).lrc
                if (lrc) {
                    lyric = lrc.lyric
                }
                this.setData({
                    lyric,
                })
            })
        })
    },

    togglePlaying() {
        if (this.data.isPlaying) {
            backgroundAudioManager.pause()
        } else {
            backgroundAudioManager.play()
        }
        this.setData({
            isPlaying: !this.data.isPlaying
        })
    },

    onPrev() {
        nowPlayingIndex--;
        if (nowPlayingIndex < 0) {
            nowPlayingIndex = musiclist.length - 1
        }
        this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    },
    onNext() {
        nowPlayingIndex++;
        if (nowPlayingIndex === musiclist.length) {
            nowPlayingIndex = 0
        }
        this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    },

    onChangeLyricShow() {
        this.setData({
            isLyricShow: !this.data.isLyricShow
        })
    },
    timeUpdate(event) {
        this.selectComponent('.lyric').update(event.detail.currentTime)
    },
    onPlay(){
        this.setData({
            isPlaying:true
        })
    },
    onPause(){
        this.setData({
            isPlaying:false
        })
    },

    // 保存播放历史
    savePlayHistory(){
        // 当前播放的歌曲
        const music = musiclist[nowPlayingIndex]
        const openid = app.globalData.openid
        const history = wx.getStorageSync(openid)
        let jing = false
        for (let i = 0,len = history.length; i<len; i++) {
            if(history[i].id == music.id) {
                jing = true;
                break
            }
        }
        if(!jing) {
            history.unshift(music)
            wx.setStorage({
              data: history,
              key: openid,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})