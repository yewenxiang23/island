// components/search/index.js
import { KeywordModel } from '../../models/keyword'
import { BookModel } from '../../models/book'
import { paginationBev } from '../behaviors/pagination.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [paginationBev],
  properties: {
    more: {
      type: String,
      observer: 'loadMore'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    inputValue: '',
    loadingCenter: false,
  },
  attached() {
    const historyWords = keywordModel.getHistory()
    this.setData({
      historyWords
    })
    keywordModel.getHot()
      .then(res => {
        this.setData({
          hotWords: res.hot
        })
      })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadMore() {
      if (!this.data.inputValue) return
      if (this.data.loading) return
      if (this.hasMore()) {
        this.locked()
        bookModel.search(this.getCurrentStart(), this.data.inputValue)
          .then(res => {
            this.setMoreData(res.books)
            this.unLocked()
          },() => {
            this.unLocked()
          })
        console.log('加载更多')
      }
    },
    onCancel() {
      this.initData()
      this.triggerEvent('cancel', {}, {})
    },
    onDelete(event) {
      this.initData()
      this.setData({
        searching: false,
        inputValue: '',
      })
    },
    onConfirm(event) {
      this.setData({
        searching: true,
        loadingCenter: true
      })
      this.initData()
      const word = event.detail.text || event.detail.value
      bookModel.search(0, word)
        .then(res => {
          console.log(res)
          this.setData({
            dataArray: res.books,
            inputValue: word,
            loadingCenter: false
          })
          this.setTotal(res.total)
          keywordModel.addToHistory(word)
        })
    }
  }
})
