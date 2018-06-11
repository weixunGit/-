//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getDistanceInfo: function (Flat, Flon, Tlat, Tlon, cb) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=' + Flat + ',' + Flon + '&to=' + Tlat + ',' + Tlon + '&policy=LEAST_TIME&output=json&callback=cb&key=XFNBZ-U57K5-SSAII-QJNJ2-IQKUJ-SMBNH',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        cb(res.data)
      }
    })
  },

  // getKeywordAddress: function (cb) {
  //   wx.request({
  //     url: 'http://apis.map.qq.com/ws/place/v1/suggestion/?region=广州&keyword=中山大学南方学院&key=XFNBZ-U57K5-SSAII-QJNJ2-IQKUJ-SMBNH',
  //     data: {
  //       x: '',
  //       y: ''
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       // cb(res.data)
  //     }
  //   })
  // },

  myData: {
    aboardDestination: "请输入上车点",
    aboardLat: "1",
    aboardLon: "1",
    markers: ""
  },

  globalData: {
    userInfo: null,
    phoneNum:null
  },
  
})