// components/LoadingMore/LoadingMore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadingtext:{
      type:String,
      value:"正在加载中..."
    },
    loadedtext:{
      type:String,
      value:"没有更多数据了"
    },
    hasmore:{
      type:Boolean,
      value:true
    },
    height:{
      type:Number,
      value:100
    }

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

  }
})
