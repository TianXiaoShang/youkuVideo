// pages/storyDetail/storyDetail.js
// import {WxParse} from '../../wxParse/wxParse.js'
import {myGetData} from "../../units/request.js";
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addStoryContent:{},
    myStorage:{}                                         //保存home传入的JSON数据
  },
  addStoryDetail(e){                                     //······获取数据进行渲染，同时配置wxParse
    var article = e.data.goods_desc;
    WxParse.wxParse('article','html',article,this)
    this.setData({
      addStoryContent:e.data
    })
  },
  //将上级页面传来的json保存至storage
  handleHistorage(){
    var storyHistory = wx.getStorageSync("storyHistory")
    var History = [];
    if(!storyHistory){                                    //如果没有就创建一个空数组
      History.push(this.data.myStorage)
      wx.setStorageSync("storyHistory",History)
    }else{
      History = wx.getStorageSync("storyHistory")         //有的话在原来基础上push新的数据
      History.push(this.data.myStorage)
      var myStoryHistory = this.unique(History);          //去重
      wx.setStorageSync("storyHistory",myStoryHistory)    //重置缓存，防止大量占用内存
    }
  },
  unique(arr){    //待优化
    var newArr = [];
    var len = arr.length;
    for(var i = 0 ; i < len ; i ++){
      for(var j = i + 1 ; j < len ; j++){
        if(arr[i].id === arr[j].id){
          j = ++i;
        }
      }
      newArr.push(arr[i])
    }
    return newArr;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myStorage = JSON.parse(options.data);           //获取url拼接过来的json数据
    this.setData({
      myStorage
    })
    const myGet = new myGetData;
    myGet.getStoryDetail(options.page).then(this.addStoryDetail)    //发送数据请求后执行回调
    this.handleHistorage()                              //写入浏览历史记录
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