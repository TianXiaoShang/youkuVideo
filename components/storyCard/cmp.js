// components/storyCard/cmp.js
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
    cancelMark(e){
      const id = e.currentTarget.dataset.cancelid
      this.triggerEvent('onCancelStory',{id})
    },
    onTapMark(e){
      const id = e.currentTarget.dataset.markid
      this.triggerEvent('onTapMark',{id})
    }
  },

})
