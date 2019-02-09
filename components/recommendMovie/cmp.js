// components/recommend/cmp.js
import {myGetData} from "../../units/request.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendData:Object,
    urlType:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {        //······给每条数据添加电影type跟id，以便发送正确的数据请求，这里的JSON是home跳转进来所点击的那条数据；在电影详情页写入缓存，作为浏览历史的数据展示
    onDetailRecommend(e){
      var typeId = e.currentTarget.dataset.tapid.split('-')
      var data  = JSON.stringify(this.data.recommendData[typeId[1]-1])
      wx.navigateTo({
        url:`/pages/detailPage/detailPage?type=${typeId[0]}&id=${typeId[1]}&data=${data}`,
      })
    }
  }
})
