//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  checkRecord: function () {
    wx.navigateTo({
      url: '../HistoryData/HistoryData'
    })
  },
  changePass: function () {
    wx.navigateTo({
      url: '../ChangePassword/ChangePassword'
    })
  },
  aboutUs: function () {
    wx.navigateTo({
      url: '../About/About'
    })
  },

  out: function () {
    // var that = this
    app.myData.aboardDestination = "请输入上车点",
    app.myData.aboardLat = "1",
    app.myData.aboardLon = "1"
    wx.reLaunch({
      url: '../Passwordlogin/login',
      success: function (res) {
        
      },
    })
  },

  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    that.getUserInfo();
  },

  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }
})
