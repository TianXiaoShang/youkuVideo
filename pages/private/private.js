// pages/private/private.js
import {myGetData} from "../../units/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myMarkCounter:0,
    myHistoryCounter:0,
    unLogin:true,               //决定info区渲染规则
    userInfo:null,
    LVnum:1,
    signNum:0,
    likeLength:0
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.checkSession({          //······进入页面检测是否为登陆状态，以确定info区域渲染规则；
      success(e){
        that.getUserInfo()     //如果有登陆态，则直接可以获取用户信息；
        that.getUserFavsList() //登陆后获取我喜欢数量
      },
      fail(e){
        that.setData({
          unLogin:true         //登陆态过期，渲染info区域为未登录状态；
        })
        return                 //这里不对fail状态做login处理，因为新版本只有通过button才能唤醒获取scope权限弹窗
      }
    })
  },

  onLogIn(e){                  //······需要注意给button绑定的事件类型为bind:getuserinfo才能获取到用户点击确认与否的回调，并不是普通的bind:tap
    if(e.detail.userInfo){     //存在userInfo代表用户点击了允许
      this.getLogin()          //点击允许后执行login操作；进行登陆！另外其实这里已经得到了userInfo，只是按照流程走在登陆的回调里再展示用户信息
    }else{                     //点击不允许的情况下弹窗提示；
      console.log('不允许你玩个jb')
      wx.showToast({
        title:"您拒绝了授权",
        image:"/icon/angry.png"
      })
    }
  },

  getLogin(){                 //······执行login
    var that = this;
    wx.login({                
      success(res){           //获取code后使用code换取token并登陆
        var getData = new myGetData;
        getData.getUserCode(res.code).then(that.sucLogin,err => console.log(e,"登陆失败，这位用户的code有毒")) 
      },
      fail(err){
        wx.showToast({
          title:"登录失败，请重新登录",
          image:"/icon/angry.png"
        })
      },
      timeout(){
        wx.showToast({
          title:"登录超时，请检查网络后重试",
          image:"/icon/angry.png"
        })
      }
    });
  },
 
  sucLogin(e){                             //······登陆成功后开始获取用户信息
    // var js_token = e.data.token;
    // console.log(token)
    var wxuser = JSON.stringify(e.data.token)
    wx.setStorageSync("token", wxuser)   //在每次重新登陆都将token写入缓存，以便后续留言，收藏等功能使用；
    this.getUserInfo();      //登陆后获取用户信息
  },

  getUserInfo(){                           //······事实上userInfo根本不需要login，只要用户授权即可获取，只是一般来说都是为符合正常逻辑走个流程，实现用户标记才是首要
    var that = this;
    wx.getUserInfo({                       
      success(e){                           //得到用户信息
        that.setData({                      //更改状态渲染info区域
          myMarkCounter:that.MarkCompute(), //登陆后获取收藏的数量用于渲染
          unLogin:false,
          userInfo:e.userInfo,
          signNum:wx.getStorageSync("signNum")? wx.getStorageSync("signNum") : that.data.signNum    //获取积分信息
        })
        wx.setStorageSync("unLogin" , that.data.unLogin)        //把登陆状态写入缓存以便其他页面使用权限
      },
      fail(e){
        wx.showToast({
          title:"获取用户信息失败",
          image:"/icon/angry.png"
        })
      }
    })
  },

  onSignIn(){                             //······签到与LV部分逻辑
    var myDate = new Date();
    var year = myDate.getFullYear();
    var date = myDate.getDate();
    var month = myDate.getMonth();
    var newSignDate = ''+year+month+date;
    var lastSignDate = wx.getStorageSync("signDate")
    if(newSignDate !== lastSignDate){     //比较上一次日期，每天只能签到一次；
      this.setData({
        signNum:parseInt(this.data.signNum) +1     //积分+1
      })
      wx.showToast({
        title:"恭喜！签到成功",
      })
      if(this.data.signNum % 10 == 0){    //每10分升一级    
        this.setData({
          LVnum:this.data.LVnum ++
        })
        wx.showToast({
          title:"恭喜您！升级啦！",
        })
      }
    wx.setStorageSync('signDate',newSignDate)     //将最新的日期写入缓存
    wx.setStorageSync("signNum",this.data.signNum)
    }else{
      wx.showToast({
        title:"已经签过到了哦！",
        image:"/icon/angry.png"
      })
    }
  },
  onLikeList(){
    if(this.data.unLogin){
      wx.showToast({
        title:"请登陆后使用",
        image:"/icon/angry.png"
      })
    }else{
      wx.navigateTo({
        url:"/pages/likeList/likeList"
      })
    }
  },
  onMarkList(){                           //跳转页面->我的收藏
    if(this.data.unLogin){
      wx.showToast({
        title:"请登陆后使用",
        image:"/icon/angry.png"
      })
    }else{
      wx.navigateTo({
        url:"/pages/markList/markList"
      })
    }
  }, 
  onbrowseHistory(){                      //跳转页面->浏览历史
    wx.navigateTo({
      url:"/pages/browseHistory/browseHistory"
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  MarkCompute(){
    var counter = wx.getStorageSync('myStarArr')  
    var num = 0;
    if(counter){                     //判断收藏数组是否为true
      counter.forEach(ele => {
        if(ele){
          num ++;
        }
      })
    }
    return num
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {              //······每次展示页面都更新喜欢/收藏/历史 三项的角标数字
    var num2 = wx.getStorageSync("storyHistory").length;
    var num3 = wx.getStorageSync("VideoHistory").length;
    var historyNum = num2 + num3
    if(!this.data.unLogin){          //收藏的数量只有在登陆后才展示
      this.getUserFavsList()         //在登陆的情况下展示我喜欢的数量
      this.setData({
        myMarkCounter:this.MarkCompute(),
      })
    }else{
      this.setData({
        myMarkCounter:0,
      })
    }
    this.setData({                  
      myHistoryCounter:historyNum
    })

  },

  getUserFavsList(){               //获取我喜欢列表////////////////////////////////////////////
    var getData = new myGetData;
    getData.getUserFavsList().then(e => {
      console.log(e)
      this.setData({
        likeLength:e.data.length
      })
    })
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