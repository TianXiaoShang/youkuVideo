// components/search/cmp.js
Component({
  /**
   * 组件的属性列表
   */

  /**
   * 生命周期函数--监听页面加载
   */
  properties: {
    antistop:Array,
    flag:{
      type:Number,
      value:0,
      observer(e){       //监听值，将隐藏container区域
        this.setData({
          myShow:false,
          videoList:[]
        })
      }
    },
    searchVideo:{
      type:Array,
      value:[],
      observer(e){
        this.setData({
          videoList:e,
        })
      }
    },
    tapVideo:{
      type:Array,
      value:[],
      observer(e){
        this.onTapVideo(e)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: '',
    myShow:false,
    myFlag:false,
    videoList:[],
    timer:null,
    lock:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    watchClose: function (e) {               //关闭按钮清空value
      this.setData({
        value: '',
        myShow:false,
      })
    },
    bindfocus(){                             //聚焦展示热推
      this.setData({
        myShow: true,
      })
    },
    onTapVideo(e){
      if(this.data.lock){                              //初次渲染为空值，防止报错只有在点击电影名字后才能执行，
        var type = "details";
        var myData = e[0].name
        var id = e[0].name.id
        myData.type = type;
        var json_data = JSON.stringify(myData);
        wx.navigateTo({
          url:`/pages/detailPage/detailPage?type=${type}&id=${id}&data=${json_data}`,
        })
      }
    },
    onSearchName(e){                         //点击直接让home请求后返回执行
      var searchName = e.currentTarget.dataset.searchname;
      this.triggerEvent("onTapName",{searchName})     
      this.setData({
        lock : true
      })
    },
    onInput(e){                               //input事件
      clearTimeout(this.data.timer)           //防抖处理
      var that = this;   
      this.data.timer = setTimeout(function (){
        var searchName = e.detail.value;
        that.setData({
          value: e.detail.value,
        })
        if(searchName == ''){
          that.setData({
            myShow:false,
          })
        }else{
          that.setData({
            myShow:true,
          })
        }
        that.triggerEvent("onInput",{searchName})      //一定要传对象
      },500)
    },
    onSearchVideo(e){
      var id = e.currentTarget.dataset.id;
      var type = "details";
      var myData = null;
      this.data.videoList.forEach(ele => {
        if(ele.id == id){
          myData = ele.name;
        }
      })
      myData.type = type;
      var json_data = JSON.stringify(myData);
      console.log(json_data)
      wx.navigateTo({
        url:`/pages/detailPage/detailPage?type=${type}&id=${id}&data=${json_data}`,
      })
    }
  }
})
