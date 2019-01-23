// pages/my/my.js
import { ClassiModel } from '../../models/classic'
import { BookModel } from '../../models/book'

const classiModel = new ClassiModel()
const bookModel = new BookModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: {},
    bookCount:0,
    classics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userAuthorized()
    this.getMyBookCount()
    this.getMyFavor()
  },
  userAuthorized(){
    wx.getSetting({
      success: data => {
        if(data.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success: data => {
              this.setData({
                authorized: true,
                userInfo: data.userInfo
              })
            }
          })
        }
      }
    })
  },
  getMyFavor(){
    classiModel.getMyFavor(res => {
      this.setData({
        classics: res
      })
    })
  },
  getMyBookCount(){
    bookModel.getMyBookCount()
    .then(res => {
      this.setData({
        bookCount: res.count
      })
    })
  },
  getInfo(data){
    const userInfo = data.detail.userInfo
    if(userInfo){
      this.setData({
        userInfo,
        authorized: true
      })
    }
  }
})