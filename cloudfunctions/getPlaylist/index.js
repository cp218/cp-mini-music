// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//引入云数据库
const db = cloud.database()
//引入request-promise  第三方地址接口访问组件
const rp = require('request-promise');
//接口获取音乐数据
//const URL = "http://musicapi.xiecheng.live/personalized"
//const URL = "http://u-to-world.com:3000/personalized"
//网易云API接口
//const URL = "http://neteasecloudmusicapi.zhaoboy.com/personalized"
//本地ngrok
const URL = "http://music.free.idcfengye.com/personalized"
//数据集合
const playlistCollection = db.collection('playlist')
//最大数据限制
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  //获取数据库已有数据
  // 通过get的方式取到playlist数据库中的所有数据
  // 只能获取100条数据
  // const list = await playlistCollection.get();
  const countResult = await playlistCollection.count()// 获取数据库中的数据总数,返回的是一个对象
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)  /**向下取整 */
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  //接口数据
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  console.log(playlist)
  // 去重处理
  const newData = [];
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true;
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id == list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  //向云数据库插入数据
  for (let i = 0, len = newData.length; i<len; i++){
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log('插入失败')
    })
  }

  return newData.length
}