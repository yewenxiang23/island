import { HTTP } from '../util/http.js'
class ClassiModel extends HTTP {
  getLates(sCallback) {
    this.request({
      url: 'classic/latest',
      success: res => {
        sCallback(res)
        this._setLatestIndex(res.index)
        let key = this._getKey(res.index)
        wx.setStorageSync(key, res)
      }
    })
  }
  getMyFavor(success) {
    const params = {
      url: 'classic/favor',
      success
    }
    this.request(params)
  }
  getClassic(index, nextOrPrevious, sCallback) {
    let key = nextOrPrevious == 'next' ? this._getKey(index + 1) : this._getKey(index - 1)
    let classic = wx.getStorageSync(key)
    console.log(classic)
    if (!classic) {
      this.request({
        url: `classic/${index}/${nextOrPrevious}`,
        success: res => {
          wx.setStorageSync(this._getKey(res.index), res)
          sCallback(res)
        }
      })
    } else {
      sCallback(classic)
    }
  }
  isFirst(index) {
    return index == 1 ? true : false
  }
  isLatest(index) {
    let latestIndex = this._getLatestIndex()
    return latestIndex == index ? true : false
  }
  _getKey(index) {
    let key = `classic-${index}`
    return key
  }
  _setLatestIndex(index) {
    wx.setStorageSync('latest', index)  //同步写入
  }
  _getLatestIndex() {
    return wx.getStorageSync('latest')
  }
}
export { ClassiModel }