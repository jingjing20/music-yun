// components/search/search.js
// 查询关键字
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type:String,
      value:"请输入关键字"
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
    onInput(event){
      keyword = event.detail.value
    }, 
    onSearch(event) {
      // console.log(keyword)
      this.triggerEvent('search', {
        keyword
      })
    },
  }
})
