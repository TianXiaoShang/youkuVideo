// components/videoCard/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    markList:Array,
    dataLength:Number,
    cancelText:String
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
    cancelVideo(e){                            //删除浏览历史事件
      const name = e.currentTarget.dataset.cancelname
      this.triggerEvent('onCancelStory',{name})
    },
    onTapvideoHistory(e){                       //触发事件，传递给父级type,id,json
      var name = e.currentTarget.dataset.name;
      var type = e.currentTarget.dataset.type;
      var id = e.currentTarget.dataset.id;
      var json_data;
      this.data.markList.forEach(ele => {
        if(ele.name == name || ele.curriculum == name){
          json_data = JSON.stringify(ele)
        }
      })
      this.triggerEvent('onTapVideo',{type,id,json_data})
    }
  }
})
