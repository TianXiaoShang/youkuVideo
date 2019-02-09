// pages/browseHistory/browseHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storyHistory:[],
    videoHistory:[],
    videoHistoryClass:"historyTitle",
    storyHistoryClass:'historyTitle-active',
    sHistory:"none",
    vHistory:"block",
    vWidth:"60%",
    sWidth:"40%",
    SdataLength:1,
    VdataLength:1,
    cancelText:"删除历史"
  },
  getHistoryData(){            //······获取缓存数据，并逆转数组；
    var storyHistory = wx.getStorageSync("storyHistory")
    var videoHistory = wx.getStorageSync("VideoHistory")
    if(storyHistory){
      storyHistory.reverse();    //逆转数组，最后浏览在最上面
    }
    if(videoHistory){
      videoHistory.reverse()
    }
    this.setData({
      storyHistory,
      videoHistory,
      SdataLength:storyHistory.length,
      VdataLength:videoHistory.length
    })
  },
  onTapStory(e){               //······点击获取其id跳转页面，同时在这里的JSON处理，使得在这里进入页面也会被计入历史记录并本条作为最新浏览置顶
    var page = e.detail.id;
    var currentData ;
    this.data.storyHistory.forEach((ele => {
      if(ele.id == page){
        currentData = ele;
      }
    }))
    wx.navigateTo({
      url:`/pages/storyDetail/storyDetail?page=${page}&data=${JSON.stringify(currentData)}`
    })
  },

  onTapVideo(e){
    var {type,json_data,id} = e.detail;
    wx.navigateTo({
      url:`/pages/detailPage/detailPage?type=${type}&id=${id}&data=${json_data}`,
    })
  },


  onchangerType(e){           //······切换title样式
    var type = e.target.dataset.type;
    if(type == "sHistory"){
      this.setData({
        sHistory:"block",
        vHistory:"none",
        vWidth:"40%",
        sWidth:"60%"
      })
    }else{
      this.setData({
        sHistory:"none",
        vHistory:"block",
        vWidth:"60%",
        sWidth:"40%"
      })
    }
  },


  cancelStory(e){            //······删除电影故事历史记录操作（切除并重新赋值缓存）
    var id = e.detail.id
    this.data.storyHistory.forEach((ele,index) =>{
      if(ele.id == id){
        var temp = this.data.storyHistory;
        temp.splice(index,1);
        this.setData({
          storyHistory:temp,
          SdataLength:temp.length,
        })
        wx.setStorageSync("storyHistory",temp)
      }
    })
  },
  cancelVideo(e){            //······删除电影历史炒作
    var videoName = e.detail.name
    console.log(videoName)
    this.data.videoHistory.forEach((ele, index) => {
      console.log(ele)
      if (ele.name == videoName || ele.curriculum == videoName){
        var temp = this.data.videoHistory;
        temp.splice(index, 1);
        this.setData({
          videoHistory:temp,
          VdataLength:temp.length
        })
        wx.setStorageSync("VideoHistory",temp)
      } 
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
    this.getHistoryData()
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