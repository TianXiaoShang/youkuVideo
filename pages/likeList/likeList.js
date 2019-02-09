// pages/likeList/likeList.js
import {myGetData} from "../../units/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
    dataLength:1,
    cancelText:''
  },
  getUserFavsList(){
    var getData = new myGetData;
    getData.getUserFavsList().then(this.getUsLikeAllData,err => console.log(err))
  },
  getUsLikeAllData(e){         //获取喜欢列表的渲染数据，使用缓存跟like对接，用户清除缓存会bug，暂时凑合实现需求吧，接口不够完善目前；
    var allData = wx.getStorageSync("usLikeAllData");
    var temp= [];
    e.data.forEach(ele => {
      for(var i = 0; i < allData.length; i++){
        if(ele.goods.curriculum == allData[i].curriculum){
          temp.push(allData[i])
        }
      }
    })
    this.setData({
      videoList:temp,
      dataLength:temp.length
    })
    console.log(temp)
  },
  onTapVideo(e){
    var {type,json_data,id} = e.detail;
    wx.navigateTo({
      url:`/pages/detailPage/detailPage?type=${type}&id=${id}&data=${json_data}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getUserFavsList()
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