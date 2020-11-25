// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入tcb-router
const TcbRouter = require('tcb-router')

const rp = require('request-promise');

//const BASE_URL = 'http://u-to-world.com:3000'
//const BASE_URL = 'http://neteasecloudmusicapi.zhaoboy.com' 
//本地ngrok
const BASE_URL = "http://music.free.idcfengye.com"

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  //路由
  const app = new TcbRouter({
    event
  })

  app.router('playlist', async(ctx, next) => {
    //获取数据库数据  返回给前端页面展示
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  //歌曲列表
  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then(res => {
        return JSON.parse(res)
      })
  })

  //歌曲信息
  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/song/url?id= ${event.musicId}`)
      .then(res => {
        return res
      })
  })

  //歌词信息
  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/lyric?id= ${event.musicId}`)
      .then(res => {
        return res
      })
  })
  
  return app.serve()
}