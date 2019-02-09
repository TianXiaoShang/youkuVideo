// pages/markList/markList.js
import {myGetData} from "../../units/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markList:[],
    myStarArr:[],
    allData:[],
    dataLength:1,
    cancelText:"取消收藏"
  },

  // 初始init函数
  addMaekData(e){
    this.fillData(e)                       //给数据填充addStar属性，便于后续通过该值判断是否需要移除列表
    this.filterData()                      //根据myStarArr数组取出对应的收藏的item渲染
  },


  filterData(){                                 //根据缓存的数组来push保存收藏的数据用于渲染页面（用数组的index与数据的index对应随后取出）
    var newArr=[];
    this.data.myStarArr.forEach((ele, index) => {
      if(ele == true){
        newArr.push(this.data.allData[index])
      }
    })
    this.setData({    
      markList:newArr,
      dataLength:newArr.length
    })
  },


  fillData(e){                                   // 将数组中的addStar填充进数据（赋值）；
    var temp = e.data;
    temp.forEach((ele,index) => {
      ele.addStar = this.data.myStarArr[index]
    });
    this.setData({
      allData:temp
    })
  },

  cancelMark(e){                                  //取消收藏，改变数组的boolean值；重新渲染页面并写入缓存
    var num = e.detail.id;
    var arr = this.data.myStarArr;
    arr[num -1] = !arr[num -1]
    this.setData({
      myStarArr:arr
    })
    this.filterData();
    wx.setStorageSync('myStarArr',arr)
  },

  onTapMark(e){                                  //点击进入对应的文章详情页；
    var id = e.detail.id
    var currentData;
    this.data.allData.forEach(ele => {           //获取点击的该项数据，传入便于详情页会进行浏览历史的缓存写入
      if(ele.id == id){
        currentData = ele;
      }
    })
    wx.navigateTo({
      url:`/pages/storyDetail/storyDetail?page=${id}&data=${JSON.stringify(currentData)}`
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myStarArr = wx.getStorageSync('myStarArr')               //取缓存的收藏数据
    var lock = false;
    if(myStarArr){                                               //首先在有缓存的情况下，没有浏览过电影故事则没有；
      myStarArr.forEach(ele => {                                 //有true则代表有被收藏的电影故事
        if(ele == true){
          lock = true
        }
      })
    }
    
    if(!lock){
      this.setData({
        dataLength:0
      })
      return                                                     //如果收藏为空则不需要请求数据；
    }else{
      this.setData({
        myStarArr
      })
      var getData = new myGetData;
      getData.getStoryData().then(this.addMaekData)
    }
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