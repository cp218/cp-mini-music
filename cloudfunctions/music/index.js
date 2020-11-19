// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入tcb-router
const TcbRouter = require('tcb-router')

const rp = require('request-promise');

//const BASE_URL = 'http://u-to-world.com:3000'
const BASE_URL = 'http://neteasecloudmusicapi.zhaoboy.com'

cloud.init()

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
      .orderBy('creatTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then(res => {
        return JSON.parse(res)
      })
  })
  
  return app.serve()
}