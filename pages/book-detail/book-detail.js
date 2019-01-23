// pages/book-detail/book-detail.js
import { BookModel } from '../../models/book'
import { LikeModel } from '../../models/like'
const bookModel = new BookModel()
const likeModel = new LikeModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    book: null,
    likeStatus: false,
    likeCount: 0,
    posting: false, //是否打开评论框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const id = options.id
    const detail = bookModel.getDetail(id)
    const comments = bookModel.getComments(id)
    const likeStatus = bookModel.getLikeStatus(id)
    Promise.all([detail, comments, likeStatus])
    .then(res => {
      this.setData({
        book:res[0],
        comments:res[1].comments,
        likeStatus:res[2].like_status,
        likeCount:res[2].fav_nums
      })
      wx.hideLoading()
    })
    // bookModel.getDetail(id)
    //   .then(res => {
    //     console.log(res)
    //     this.setData({
    //       book: res
    //     })
    //   })

    // bookModel.getComments(id)
    //   .then(res => {
    //     console.log(res)
    //     this.setData({
    //       comments: res.comments
    //     })
    //   })
    // bookModel.getLikeStatus(id)
    //   .then(res => {
    //     console.log(res)
    //     this.setData({
    //       likeStatus: res.like_status,
    //       likeCount: res.fav_nums
    //     })
    //   })
  },
  onLike(event) {
    const like_or_cancel = event.detail.behavior
    likeModel.like(like_or_cancel, this.data.book.id, 400)
  },
  onFakePost() {
    this.setData({
      posting: true
    })
  },
  onCancel() {
    this.setData({
      posting: false
    })
  },
  onPost(event) {
    const comment = event.detail.text || event.detail.value
    if (!comment) return
    if (comment.length > 12) {
      wx.showToast({
        title: '短评最多12个字',
        icon: 'none'
      })
      return
    }
    bookModel.postComment(this.data.book.id, comment)
      .then(res => {
        console.log(res)
        wx.showToast({
          title: '+ 1',
          icon: 'none'
        })
        console.log(comment)
        this.data.comments.unshift({
          content: comment,
          nums: 1,
        })
        console.log(this.data.comments)
        this.setData({
          comments: this.data.comments,
          posting: false
        })
      })
  }
})