// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

/**
 * 组件的监听器
 */
  observers: {
    /** 监听对象：'playlist' */
    /** 监听对象的值：'playlist.playcount' */
    ['playlist.playCount'](count){
      //console.log(count)
      this._tranNuber(count, 2)
      //重新赋值
      this.setData({
        /**需重新定义需要赋值的值 */
        _count : this._tranNuber(count, 2)
        /**
         * 以下赋值形式：会造成死循环 因为 playlist.playCount 在变化，监听就会一直执行
         * 'playlist.playCount': this._tranNuber(count, 2)
         */
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**截取数值方法 */
    _tranNuber(num, point){
      /**取出.前面的数值 */
      let numStr = num.toString().split('.')[0]
      /**如果长度小于6 直接返回*/
      if(numStr.length<6){
        return numStr
      }else if(numStr.length >=6 && numStr.length <=8 ){ 
        /**如果大于6小于8  截取倒数第4-倒数第3两位 作为小数 */
        let decimal = numStr.substring(numStr.length-4, numStr.length-4+point)
        return parseFloat(parseInt(num/10000) + "." + decimal) + "万"
      } else if (numStr.length > 8){
        /**如果大于6小于8  截取倒数第8-倒数第7两位 作为小数 */
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + "." + decimal) + "亿"
      }
    },

    /**
     * 点击调转歌单列表
     */
    goToMusiclist(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    }
  }
})
