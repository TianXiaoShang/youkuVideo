// components/navigate/cmp.js
Component({
  options:{
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onNavigate(){                //获取当前页面跳转来源，判断是否为第一页，只要是从其他页面跳转过来的都赋予back功能
      const curPages = getCurrentPages();
      const path = curPages[curPages.length -1].__route__
      const home = path.indexOf('pages/home/home')
      const story = path.indexOf('pages/story/story')
      const privates = path.indexOf('pages/private/private')
      if(home == -1 && story == -1 && privates ==-1){         //在初级页面的情况下不执行back并弹窗提示
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title:'讨厌，别乱摸啦',
          image:'/icon/angry.png'
        })
      }
    }
  }
})
