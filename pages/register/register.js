var app = getApp()
// var step = 1 // 当前操作的step  
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")
var step_g = 1


var phoneNum = null, identifyCode = null, password = null, rePassword = null;

Page({
  data: {
    windowWidth: 0,
    windoeHeight: 0,
    phone: "",
    password: "",
    icon_phone: "../images/phone.png",
    input_icon: "../images/phoneCheck.png",
    icon_password: "../images/key.png",
    location: "中国",
    nextButtonWidth: 0,
    step: step_g,
    time: currentTime,
    indentify: null
  },
  onLoad: function () {
    step_g = 1
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          nextButtonWidth: res.windowWidth - 20
        })
      }
    })
  },
  onUnload: function () {
    phoneNum = null;
    currentTime = maxTime
    if (interval != null) {
      clearInterval(interval)
    }
  },
  nextStep: function () {
    var that = this
    if (step_g == 1) {
      that.firstStep();

    } else if (step_g == 2) {
      if (secondStep()) {
        step_g = 3
        // clearInterval(interval)
      }
    } else {
      thirdStep(phoneNum)
    }

    // if (hintMsg != null) {
    //   wx.showToast({
    //     title: hintMsg,
    //     icon: 'loading',
    //     duration: 700
    //   })
    // }

    // this.setData({
    //   step: step_g
    // })
  },
  input_phoneNum: function (e) {
    phoneNum = e.detail.value
  },
  input_identifyCode: function (e) {
    identifyCode = e.detail.value
  },
  input_password: function (e) {
    password = e.detail.value
  },
  input_rePassword: function (e) {
    rePassword = e.detail.value
  },
  reSendPhoneNum: function () {
    if (currentTime < 0) {
      var that = this
      currentTime = maxTime
      interval = setInterval(function () {
        currentTime--
        that.setData({
          time: currentTime
        })

        if (currentTime <= 0) {
          currentTime = -1
          clearInterval(interval)
        }
      }, 1000)
    } else {
      wx.showToast({
        title: '短信已发到您的手机，请稍后重试!',
        icon: 'loading',
        duration: 700
      })
    }
  },

  firstStep: function () { // 提交电话号码，获取［验证码］ 
    var that = this
    if (!check.checkPhoneNum(phoneNum)) {
      wx.showToast({
        title: '电话号码错误！',
        image: '../images/fail.png',
      })
      return false
    } else if (check.checkPhoneNum(phoneNum)) {
      hintMsg = null
      that.checkPass(phoneNum)
      setTimeout(function () {
        if (that.data.indentify == "0") {
          wx.showToast({
            title: '该手机已注册',
            image: '../images/fail.png',
          })
        } else if (that.data.indentify == "1") {
          step_g = 3
          that.setData({
            step: step_g,
            indentify: null
          })
        }
      }, 500)
    } else {
      wx.showToast({
        title: '请稍后重试!',
        icon:'loading'
      })
      return false
    }
  },

  checkPass: function (phone) {
    var that = this
    wx.request({
      url: 'http://111.230.35.130:8080/WebSocketDemo/register',
      data: {
        way: "checkPhone",
        phoneNum: phone,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({ indentify: res.data })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  }
})


function secondStep() { // 提交［验证码］  
  if (!check.checkIsNotNull(identifyCode)) {
    wx.showToast({
      title: '请输入验证码!',
    })
    return false
  }

  else if (webUtils.submitIdentifyCode(identifyCode)) {
    hintMsg = null
    return true
  } else {
    wx.showToast({
      title: '请稍后重试!',
    })
    return false
  }
}

function thirdStep(phone) { // 提交［密码］和［重新密码］  
  console.log(password + "==" + rePassword)

  if (!check.isContentEqual(password, rePassword)) {
    wx.showToast({
      title: '密码不一致！',
      image: '../images/fail.png',
    })
  } else if (check.isContentEqual(password, rePassword)) {
    if (password == null || rePassword == null){
      wx.showToast({
        title: "请输入全部信息",
        image: '../images/loginfail.png',
      })
    }else{
      if (check.checkPassword(password, rePassword)){
        wx.request({
          url: 'http://111.230.35.130:8080/WebSocketDemo/register',
          data: {
            way: "InsertUser",
            phoneNum: phone,
            password: password
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res)
            if (res.data != -1) {    //完成注册
              wx.showToast({
                title: "注册成功",
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: "../Passwordlogin/login"
                })
              }, 1000)
            } else {
              wx.showToast({
                title: "注册失败",
                icon: 'loading'
              })
            }
          },
          fail: function (res) {
            console.log(".....fail.....");
          }
        })
      }
    }
  } else {
    wx.showToast({
      title: "请稍后重试!",
    })
  }
}
