// pages/playlist/playlist.js
//每次拉取数据条数
const MAX_LIMIT = 15
//引入数据库连接
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
      url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: [],

  },

  //getPlaylist方法
  _getPlaylist() {
    //界面加载中
    wx.showLoading({
      title: '加载中',
    })
    //请求云函数，得到数据
    wx.cloud.callFunction({
      name: 'music',// 云函数的名称
      data: {
        start: this.data.playlist.length, //每次读取数据起始数 0,15,30....
        count: MAX_LIMIT,                 //每次读取数据限制数 15
        $url: 'playlist'
      }//参数
    }).then((res) => {
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)//在当前数据的基础上拼接
      })
      wx.stopPullDownRefresh()//停止当前页面下拉刷新
      wx.hideLoading() //隐藏加载中
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
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
    //清空数据
    this.setData({
      playlist: []
    })
    //执行方法，拉取云端数据库数据
    this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})