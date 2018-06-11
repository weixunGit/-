var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
    newPass: "",
    renewPass: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.phoneNum != null) {
      that.setData({ phone: app.globalData.phoneNum })
    }
  },

  passInput: function (e) {
    var that = this
    var pass = e.detail.value;
    if (pass.length >= 1) {
      that.setData({
        password: pass
      })
    } else {
      that.setData({
        password: ""
      })
    }
  },
  newPassInput: function (e) {
    var that = this
    var pass = e.detail.value;
    if (pass.length >= 1) {
      that.setData({
        newPass: pass
      })
    } else {
      that.setData({
        newPass: ""
      })
    }
  },
  reNewPassInput: function (e) {
    var that = this
    var pass = e.detail.value;
    if (pass.length >= 1) {
      that.setData({
        renewPass: pass
      })
    } else {
      that.setData({
        renewPass: ""
      })
    }
  },

  changePass: function () {
    var that = this
    if (that.data.password != "" && that.data.newPass != "" && that.data.renewPass != "") {
    if (that.data.password.length >= 6 && that.data.newPass.length >= 6 && that.data.renewPass.length >= 6){

        if (that.data.newPass == that.data.renewPass) {
          wx.request({
            url: 'http://111.230.35.130:8080/WebSocketDemo/ChangePass',
            data: {
              phone: that.data.phone,
              password: that.data.password,
              repassword: that.data.newPass
            },
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              if (res.data == false) {
                wx.showToast({
                  title: '原始密码错误',
                  image: '../images/fail.png',
                })
              } else if (res.data == "修改密码成功") {
                wx.showToast({
                  title: '修改密码成功',
                })
                setTimeout(function () {
                  app.myData.aboardDestination = "请输入上车点",
                    app.myData.aboardLat = "1",
                    app.myData.aboardLon = "1"
                  wx.reLaunch({
                    url: '../Passwordlogin/login',
                  })
                }, 1500)
              }
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          })
        } else {
          wx.showToast({
            title: '新密码不一致',
            image: '../images/fail.png',
          })
        }
      }else{
        wx.showToast({
          title: '密码均不少6位',
          image: '../images/loginfail.png',
        })
      }
    } else {
      wx.showToast({
        title: '请输入全部信息',
        image: '../images/loginfail.png',
      })
    }
  }
})
