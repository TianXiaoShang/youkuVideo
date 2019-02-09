// pages/index/index.js
import {myGetData} from "../../units/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:"details",      //三个不同区域的请求路径
    daily:"daily",
    broadcast:"broadcast",
    swiperData:[],
    inlandRecommendData:[],
    HKRecommendData:[],
    next:' ',               //查看是否有下一页的数据(同时因为要控制底部提示没有更多的文字所以打了个空格，避免在第一次加载时候出现)；
    touchBottom:false,
    searchVideo:[],
    tapVideo:[],
    flag:1,  
    // area:'',  
    antistop:['叶问','黑社会2以和为贵','天若有情','食神','英雄本色','大话西游之大圣娶亲','心花怒放']
  }, 

  onTapWrap(){                 //触碰到input外的区域将隐藏input的container区域
      this.setData({
        flag: ++ this.data.flag
      })
  },
  onTapName(e){               //点击电影名返回数据供跳转
    var name = e.detail.searchName;
    var getData = new myGetData();
    getData.getSearchVideo(name).then(e => {
      this.setData({
        tapVideo:e.data
      })
    },err => console.log("搜索请求错误"))
  },
  onInput(e){                //监听input发送请求
    var name = e.detail.searchName;
    var getData = new myGetData();
    getData.getSearchVideo(name).then(e => {
      var temp = e.data.splice(0,4)
      this.setData({
        searchVideo:temp
      })
    },err => console.log("搜索请求错误"))
  },

  requestSwiper:function (e){                        //赋值轮播图数据
    this.setData({
      swiperData:e.data
    })
  },
  requestInlandRecommend:function (e){               //同上
    this.setData({
      inlandRecommendData:e.data
    })
  },
  getHKRecommendData:function (e){                  //同上，另外这里实现懒加载
    this.setData({
      HKRecommendData:this.data.HKRecommendData.concat(e.data.results),    //每次触发页面触底请求新的数据都进行数组合并后渲染
      next:e.data.next
    })
  },
  onSwiperTap:function (e){                         //通过传递的typeId判断点击的区域来分别发送请求
    var typeId = e.currentTarget.dataset.tapid.split('-') 
    wx.navigateTo({
      url:`/pages/detailPage/detailPage?type=${typeId[0]}&id=${typeId[1]}&data=${JSON.stringify(this.data.swiperData[typeId[1]-1])}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {                             //请求三个区域（轮播图、大陆电影，香港电影）的数据
    var getData = new myGetData;
    getData.getSwiperData().then(this.requestSwiper , e => console.log(e))
    getData.getInlandRecommendData().then(this.requestInlandRecommend , e => console.log(e))
    getData.getHKRecommendData().then(this.getHKRecommendData , e => console.log(e))
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
  onReachBottom: function (e) {
    var getData = new myGetData;    
    const next = this.data.next;
    if(next){                   //如果next还存在下一页链接即可继续请求数据
      getData.getHKRecommendData(next).then(this.getHKRecommendData)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})