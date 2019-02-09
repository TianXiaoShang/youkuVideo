// pages/detailPage/detailPage.js
import {myGetData} from "../../units/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoPlay:true,
    detailShowControl:false,
    controlIcon:"control-icon",
    addStar:false,
    commentEmit:"comment-emit",
    curriculum:"",
    actor:[],
    videoUrl:"",
    videoImage:'',
    lecturer:'',
    fillImage:'',
    imageLoad:false,
    myStorage:{},
    videoId:null,
    myHeight:"0rpx",
    messageText:''
  },
  detailData(e){                                     //······进行数据赋值用于渲染
    const data = e.data;
    this.setData({
      curriculum:data.curriculum,
      actor:data.images,
      videoUrl:data.url,
      videoImage:data.name.image,
      lecturer:data.lecturer,
      fillImage:data.name.image,
      videoId:data.id
    })
  },
  onVideoPlay(){                                     //点击播放，隐藏封面
    const myVideo = wx.createVideoContext('detailVideo')
    myVideo.play();
    this.setData({
      videoPlay:!this.data.videoPlay
    })
  },

  onAddFavs(e){                                       //点击爱心为我喜欢列表
    if(wx.getStorageSync("unLogin") === false){       //首先进行判断是否登陆
      var likeId = e.currentTarget.dataset.likeid;
      var getData = new myGetData;
      getData.addUserFavs(likeId).then(e => {
        if(e.data.goods){
          this.setData({
            addStar:true
          })
        }
      })
    }else{
      wx.showToast({
        title:"请登录后使用哦！",
        image:"/icon/angry.png"
      })
    }
  },
  onDeleteFavs(e){
    if(wx.getStorageSync("unLogin") === false){
      var likeId = e.currentTarget.dataset.likeid;
      var getData = new myGetData;
      getData.deleteUserFavs(likeId).then(e => {
        if(!e.data){
          this.setData({
            addStar:false
          })
        }
      })
    }
  },
  checkUserFavs(id){               //发送请求检查是否被添加为我喜欢
    if(wx.getStorageSync("unLogin") === false){
      var getData = new myGetData;
      getData.checkUserFavs(id).then(e => {
        if(e.data.goods){
          this.setData({
            addStar:true              //更改爱心样式
          })
        }
      })
    }
  },
  onShowDetail(){                                  //点击收起电影简介
    this.setData({
      detailShowControl:!this.data.detailShowControl,
      controlIcon:this.data.controlIcon == "control-icon" ? "control-icon-active" : "control-icon",
    })
  },
  onCommentEmit(){                                //点击发送影评
    wx.showToast({
      title:"暂无评论接口哦！",
      image:"/icon/angry.png"
    })
    this.setData({
      commentEmit:this.data.commentEmit == "comment-emit" ? "comment-emit-active" : "comment-emit",
      messageText:''
    })
  },
  onMessages(e){         //处理键盘弹起input跟随弹起
    var height = e.detail.height;
    this.setData({
      myHeight:height +'px'
    })
  },
  endMessages(e){         //处理键盘弹起input跟随弹起
    this.setData({
      myHeight:'0px'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {                               //······进入页面处理缓存
    var getData = new myGetData;
    var type = options.type;
    var id = options.id;    
    getData.getDetailData(type,id).then(this.detailData)
    var storyData = JSON.parse(options.data)                 //把首页的当前视频的资源获取到以便存入storage；
    this.setData({
      myStorage:storyData
    })
    this.handleHistorage(type , id)                          //最后将json写入缓存并赋值type，id以便后续跳转页面
    this.checkUserFavs(id);                                  //检查当前电影是否被收藏为我喜欢；
    // this.getMessagesList();
  },

  // getMessagesList(){
  //   var getData = new myGetData;
  //   getData.getMessagesList().then(e => console.log(e))
  // },

  handleHistorage(type,id){                                  //······执行写入缓存操作
    var VideoHistory = wx.getStorageSync("VideoHistory")  
    var History;
    if(!VideoHistory){                                       //如果没有就创建一个空数组
      History = [];
      var newVideoData = this.data.myStorage
      newVideoData.type = type;
      newVideoData.id = id;
      History.push(newVideoData)
      wx.setStorageSync("VideoHistory",History);
    }else{
      History = wx.getStorageSync("VideoHistory") 
      var newVideoData = this.data.myStorage
      newVideoData.type = type;
      newVideoData.id = id;            //有的话在原来基础上push新的数据
      History.push(newVideoData)
      var myVideoHistory = this.unique(History);              //去重
      wx.setStorageSync("VideoHistory",myVideoHistory)        //重置缓存，防止大量占用内存
    }


// 以下这冗余 的代码是为了迎合我喜欢列表。接口原因，没办法了，先这样凑合着实现功能吧。。。555555.。。。。
    var usLikeAllData = wx.getStorageSync("usLikeAllData")
    var usLikeData;
    if(!usLikeAllData){
      usLikeData = [];
      var newVideoData = this.data.myStorage
      newVideoData.type = type;
      newVideoData.id = id;
      usLikeData.push(newVideoData)
      wx.setStorageSync("usLikeAllData",usLikeData);  
    } else{
      usLikeData = wx.getStorageSync("usLikeAllData")
      var newVideoData = this.data.myStorage
      newVideoData.type = type;
      newVideoData.id = id;            //有的话在原来基础上push新的数据
      usLikeData.push(newVideoData)
      var myVideoHistory = this.unique(usLikeData);              //去重
      wx.setStorageSync("usLikeAllData",myVideoHistory);  
    }
  },
  unique(arr){                                                //去重函数，选择冒泡去重，以使得最后浏览的数据在最后符合正常逻辑，我们只需要逆转数组即可；
    var newArr = [];
    var len = arr.length;
    if(len >= 1){
      for(var i = 0 ; i < len ; i ++){
        for(var j = i + 1 ; j < len ; j++){
          if(arr[i].name){
            if(arr[i].name === arr[j].name){
              j = ++i;
            }
          }else{
            if(arr[i].curriculum === arr[j].curriculum){
              j = ++i;
            }
          }
        }
        newArr.push(arr[i])
      }
    }
    return newArr;
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