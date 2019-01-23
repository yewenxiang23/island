// pages/classic/classic.js
import { ClassiModel } from '../../models/classic.js'
import { LikeModel } from '../../models/like.js'
let classicMolde = new ClassiModel()
let likeModel = new LikeModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classicData: null,
    latest: true,
    first: false,
    likeCount: 0,
    likeStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    classicMolde.getLates(res => {
      console.log(res)
      this.setData({
        classicData: res,
        likeCount: res.fav_nums,
        likeStatus: res.like_status
      })
    })
  },
  onLike(event) {
    let behavior = event.detail.behavior
    likeModel.like(behavior, this.data.classicData.id, this.data.classicData.type)
  },
  onNext(event) {
    this._updateClassic('next')
  },
  onPrevious(event) {
    this._updateClassic('previous')
  },
  _updateClassic(nextOrPrevious) {
    let index = this.data.classicData.index
    classicMolde.getClassic(index, nextOrPrevious, res => {
      this._getLikeStatus(res.id, res.type)
      this.setData({
        classicData: res,
        latest: classicMolde.isLatest(res.index),
        first: classicMolde.isFirst(res.index)
      })
    })
  },
  _getLikeStatus(artID, category){
    likeModel.getClassicLikeStatus(artID, category, res => {
      console.log(res)
      this.setData({
        likeCount: res.fav_nums,
        likeStatus: res.like_status
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})