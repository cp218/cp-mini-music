// pages/player/player.js

//定义一个数组
 let musiclist = []
 //当前播放的歌曲的index
 let nowPlayingIndex = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
//调用全局方法
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',  //歌曲封面图片
    isPlaying: false, //播放状态
    isLyricShow: false, //当前歌词是否显示
    lyric: '',
    isSame: false, //表示播放同一首歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //当前正在播放歌曲的index
    nowPlayingIndex = options.index
    //getStorage中的数据
    musiclist = wx.getStorageSync('musiclist')
    //加载歌曲详情信息
    this._loadMusicDetail(options.musicId)
  },

  /**根据index获取当前歌曲对应的详情信息 */
  _loadMusicDetail(musicId){
    //判断是否点击的是同一首歌曲
    if (musicId == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else { //如果不是，则停止上一首音乐
      this.setData({
        isSame: false
      })
      
    }
    if(!this.data.isSame){
      //停止上一首音乐
      backgroundAudioManager.stop()
    }
   
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    //改变标题名称
    wx.setNavigationBarTitle({
      title: music.name,
    })
    //设置背景
    this.setData({
      isPlaying: false,
      picUrl: music.al.picUrl,
    })

    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '歌曲加载中',
    })
    //console.log(this.data.picUrl)
    wx.cloud.callFunction({
      name: "music",
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      let result = JSON.parse(res.result)
      if (result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        // 保存播放历史
        //this.savePlayHistory()
      }
      //设置播放状态
      this.setData({
        isPlaying: true,
      })
      wx.hideLoading()

      //加载歌词
      wx.cloud.callFunction({
        name: "music",
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then(res => {
        // console.log(res)
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },

  // 切换播放
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause() //暂停
    } else {
      backgroundAudioManager.play() //播放
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  //上一首
  onPrev() {
    nowPlayingIndex--
    // 如果当前是第一首歌曲。上一首则是最后一首
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  //下一首
  onNext(){
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  //歌词显示
  onChangeLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  // 绑定歌词组件滚动
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  // 暂停歌曲播放
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },

  // 保存播放历史
  // savePlayHistory() {
  //   const music = musiclist[nowPlayingIndex]
  //   const openid = app.globalData.openid
  //   const history = wx.getStorageSync(openid)
  //   let bHave = false
  //   for (let i = 0, len = history.length; i < len; i++) {
  //     if (history[i].id == music.id) {
  //       bHave = true
  //       break
  //     }
  //   }
  //   if (!bHave) {
  //     history.unshift(music)
  //     wx.setStorage({
  //       data: history,
  //       key: openid,
  //     })
  //   }
  // },

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