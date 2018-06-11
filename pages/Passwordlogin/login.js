var app = getApp()

Page({
  data: {
    phoneNum: '',
    password: '',
  },
  // 手机号部分
  inputPhoneNum: function (e) {
    var that = this
    let phoneNum = e.detail.value
    if (phoneNum.length == 11) {
      let checkedNum = that.checkPhoneNum(phoneNum)
      if (checkedNum) {
        that.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + that.data.phoneNum)
      }
    } else {
      that.setData({
        phoneNum: ''
      })
    }
  },

  passwordInput: function (e) {
    var that = this
    var pass = e.detail.value;
    if (pass.length >= 1) {
      that.setData({
        password: pass
      })
    }else{
      that.setData({
        password: ""
      })
    }
  },

  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      // console.log("----fail----")
      wx.showToast({
        title: '手机号不正确',
        image: '../images/loginfail.png'
      })
      return false
    }
  },
  // 登录  
  login: function () {
    var that = this

    if (that.data.phoneNum.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码为空',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.request({
        url: 'http://111.230.35.130:8080/WebSocketDemo/login',
        data: {
          phone: that.data.phoneNum,
          password: that.data.password
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },

        success: function (res) {
          console.log(res.data);
          if (res.data != "") {
            // 这里修改成跳转的页面  
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            }),
            app.globalData.phoneNum = res.data
            that.setData({ phoneNum: res.data })
            wx.switchTab({
              url: '../index/index',
            })
          } else {
            wx.showToast({
              title: '账号或密码错误',
              image: '../images/loginfail.png',
              duration:1000
            })
          }
        },
        fail: function (res) {
          console.log(".....login fail.....");
        }
      })
    }
  },
  change: function () {
    wx.navigateTo({
      url: '../Phonelogin/Plogin',
    })
  },
  register: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  },

})  