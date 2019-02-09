// pages/story/story.js
import {myGetData} from "../../units/request.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storyData:[],
    starArr:[],
    myStorage:{}
  },

    // 点击路由指定id文章页面
    onStoryTap(e){       
      var page = e.currentTarget.dataset.tapid;
      this.data.storyData.forEach((ele,index) => {
        if(ele.id == page){
          this.setData({
            myStorage:ele
          })
          return 
        }
      })
      console.log(this.data.myStorage)
      wx.navigateTo({
        url:`/pages/storyDetail/storyDetail?page=${page}&data=${JSON.stringify(this.data.myStorage)}`
      })
      
    },

  // 点击收藏图标修改数组后重新设置缓存并重新渲染；
  onAddStoryStar(e){
    var unLogin = wx.getStorageSync("unLogin")
    if(unLogin === false){                          //只有在登陆状态才能点击执行操作！
      const arr= this.data.starArr;
      const id = e.currentTarget.dataset.tapid;
      arr.splice(id-1,1,!this.data.starArr[id-1])
      wx.setStorageSync('myStarArr',arr)
      this.setData({
        starArr:arr
      })
      this.fillStarArr()
    }else{
      wx.showToast({
        title:"请登录后使用！",
        image:"/icon/angry.png"
      })
    }
  },  

  // 使用starArr数组对数据重新赋值storyData
  fillStarArr(){
    var temp = this.data.storyData;
    temp.forEach((ele,index) => {
      ele.addStar = this.data.starArr[index]
    });
    this.setData({
      storyData:temp
    })                                                                                        
  },

  // 获取缓存，如果没有则创建一个全部为false的数组作为缓存
  getStorage(){
    var myStarArr = wx.getStorageSync('myStarArr')
        if(!myStarArr){
          console.log(this.data.storyData.length)          
          var arr = new Array(this.data.storyData.length).fill(false); 
          this.setData({
              starArr:arr,
            })
            wx.setStorageSync('myStarArr',arr)
          console.log(arr)
          }else{
            this.setData({
              starArr:myStarArr,
            })
        }
  },


  //获取数据后写入数据，随后通过书签数组对数据进行填充修补
  addStoryData(e){
    this.setData({
      storyData:e.data
    })
    this.getStorage()   //取缓存至starArr数组
    this.fillStarArr()   //使用starArr对渲染数组storyData进行修改
  },

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var getData = new myGetData;
    getData.getStoryData().then(this.addStoryData)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var myStarArr = wx.getStorageSync('myStarArr')
    if(myStarArr){
      this.setData({
        starArr:myStarArr
      })
      this.fillStarArr()   //使用starArr对渲染数组storyData进行修改    
    }

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