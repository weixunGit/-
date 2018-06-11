// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// var dingwei = require('../../libs/dingwei.js');

var app = getApp()
var interval = null
var disInterval = null

var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html
  key: 'XFNBZ-U57K5-SSAII-QJNJ2-IQKUJ-SMBNH'
});
Page({
  data: {
    windowWidth: "",
    windowHeight: "",

    myLatitude: "",
    myLongitude: "",
    myAddress: "",
    phoneNum: "",

    lookLatitude: "",
    lookLongitude: "",

    busLatitude: "",
    busLongitude: "",

    desAddress: "请输入上车点",
    desLatitude: "1",
    desLongitude: "1",

    setDesAddress: "请输入上车点",
    setDesLatitude: "1",

    distance: "",
    time: "",
    message: false,

    mapHeight: "",
    messageHeight: "",
    scale: "28",
    markers: [],
    polyline: [],
    controls: []
  },

  onLoad: function () {
    if (interval != null) {
      clearInterval(interval)
    }
    var that = this
    that.getPhoneSize()
    that.setData({
      mapHeight: that.data.windowHeight - 50,
      messageHeight: that.data.windowHeight - 100,
      controls: [{
        id: 1,
        iconPath: '../images/personIcon.png',
        position: {
          left: that.data.windowWidth - 40,
          top: 20,
          width: 25,
          height: 25
        },
        clickable: true
      },
      {
        id: 2,
        iconPath: '../images/busIcon.png',
        position: {
          left: that.data.windowWidth - 40,
          top: 70,
          width: 25,
          height: 25
        },
        clickable: true
      },
      {
        id: 3,
        iconPath: '../images/destinationIcon.png',
        position: {
          left: that.data.windowWidth - 40,
          top: 120,
          width: 25,
          height: 25
        },
        clickable: true
      }
      ]
    })

    if (app.globalData.phoneNum != null) {
      that.setData({ phoneNum: app.globalData.phoneNum })
    }
    if (app.globalData.phoneNum == "11111111111") {
      that.setBusAddress(that)
    } else {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          that.setData({
            lookLatitude: res.latitude, lookLongitude: res.longitude,
            myLatitude: res.latitude, myLongitude: res.longitude
          })

        }
      })
      that.getBusAddress()
    }

  },

  onShow: function () {
    var that = this 
    if (app.myData.aboardLat != "1" && app.myData.aboardLon != "1") {
      if (app.myData.aboardLat != that.data.desLatitude &&
        app.myData.aboardLon != that.data.desLongitude) {
        if (app.globalData.phoneNum != "11111111111") {
          if (interval != null) {
            clearInterval(interval)
          }
          that.getBusAddress()
        }
        that.setData({
          desAddress: app.myData.aboardDestination,
          desLatitude: app.myData.aboardLat,
          desLongitude: app.myData.aboardLon
        })

        that.addAddressMarkers()
      }
    }
  },


  getPhoneSize: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
  },

  addAddressMarkers: function () {
    var that = this

    if (that.data.desLatitude != "1" && that.data.desLongitude != "1") {
      var marker = that.data.markers
      if (marker.length == 1) {
        marker.push({
          iconPath: "../images/location.png",
          id: 1,
          latitude: that.data.desLatitude,
          longitude: that.data.desLongitude,
          width: 40,
          height: 40,
          title: that.data.desAddress
        })
        that.setData({
          markers: marker,
          scale: "16"
        })
      } else if (marker[1].id == 1) {
        clearInterval(disInterval)
        that.setData({
          ['markers[1].latitude']: that.data.desLatitude,
          ['markers[1].longitude']: that.data.desLongitude,
          ['markers[1].title']: that.data.desAddress,
          scale: "16"
        })
      }
    }
    //清除之前的路线规划
    var line = that.data.polyline;
    if (line.length != 0) {
      that.setData({ polyline: [] })
    }

    //撤销之前的规划时间和路程
    if (that.data.mapHeight == that.data.messageHeight) {
      that.setData({
        mapHeight: that.data.windowHeight - 50
      })
    }
  },

  setBusAddress: function (that) {

    interval = setInterval(function () {

      //用微信提供的api获取经纬度
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          that.setData({
            myLatitude: res.latitude, myLongitude: res.longitude,
            lookLatitude: res.latitude, lookLongitude: res.longitude
          })
          wx.request({
            url: 'http://111.230.35.130:8080/WebSocketDemo/setBus',
            data: {
              lat: res.latitude,
              lon: res.longitude
            },
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          })
        }
      })
    }, 1500) //延迟时间 这里是1秒

  },

  getBusAddress: function () {
    var that = this
    interval = setInterval(function () {

      wx.request({
        url: 'http://111.230.35.130:8080/WebSocketDemo/getBus',
        data: {

        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var busData = res.data.split(",")
          that.setData({
            busLatitude: busData[0],
            busLongitude: busData[1]
          })
          var marker = that.data.markers
          if (marker.length == 0) {
            console.log(that.data.markers)
            console.log("markers为空")
            marker.push({
              iconPath: "../images/bus.png",
              id: 0,
              latitude: busData[0],
              longitude: busData[1],
              width: 30,
              height: 30,
            })
            that.setData({
              markers: marker
            })
          } else if (marker[0].id == 0) {
            var changelat = "markers[0].latitude"
            var changelon = "markers[0].longitude"
            that.setData({
              [changelat]: busData[0],
              [changelon]: busData[1]
            })
          }
        },
        fail: function (res) {
          console.log(".....getBus fail.....");
        }
      })
    }, 2000) //延迟时间 这里是1秒
  },

  getCoors: function (coors) {
    var b = []
    for (var i = 2; i < coors.length; i++) {
      coors[i] = coors[i - 2] + coors[i] / 1000000
    }
    // console.log("polyline:" + coors[2])
    for (var i = 0; i < coors.length; i = i + 2) {
      b[i / 2] = { latitude: coors[i], longitude: coors[i + 1] }
      // console.log(b[i / 2])
    }
    if (b != null) {
      return b;
    }
  },

  getmyLine: function () {
    var that = this
    var myb = []

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          myLatitude: res.latitude, myLongitude: res.longitude
        })
        app.getDistanceInfo
          (that.data.myLatitude, that.data.myLongitude, that.data.desLatitude, that.data.desLongitude, function (data) {
            var mycoors = data.result.routes[0].polyline;
            // var mydistance = data.result.routes[0].distance;
            // var mytime = data.result.routes[0].duration;

            var line = that.data.polyline;
            myb = that.getCoors(mycoors)
            console.log(line.length)
            if (line.length == 1) {
              console.log("进入myline")
              line.push({
                points: myb,
                color: "#50F350",
                width: 4,
                dottedLine: true,
              })
              that.setData({
                polyline: line
              })
            } else if (line.length == 2) {
              that.setData({
                ['polyline[1].points']: myb,
              })
            }
          });
      }
    })
  },

  setRecord: function () {
    var that = this
    wx.request({
      url: 'http://111.230.35.130:8080/WebSocketDemo/Record',
      data: {
        way: "set",
        phone: that.data.phoneNum,
        location: that.data.desAddress
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log(".....setRecord fail.....");
      }
    })
  },

  //计算距离和时间的方法
  getDistance: function () {
    var that = this
    clearInterval(disInterval)
    var b = []

    if (that.data.desAddress == "请输入上车点") {
      wx.showToast({
        title: '请选择上车点',
        // image: '../../images/fail.png'
      })
    } else {
      disInterval = setInterval(function () {

        app.getDistanceInfo
          (that.data.busLatitude, that.data.busLongitude, that.data.desLatitude, that.data.desLongitude, function (data) {
            var coors = data.result.routes[0].polyline;
            var distance = data.result.routes[0].distance;
            var time = data.result.routes[0].duration;

            that.setData({
              mapHeight: that.data.messageHeight,
              distance: distance,
              time: time,
              message: true
            })
            var line = that.data.polyline;
            b = that.getCoors(coors)
            if (line.length == 0) {
              line.push({
                points: b,
                color: "#0066FF",
                width: 4,
                dottedLine: false,
              })
              that.setData({ polyline: line })
            } else if (line.length != 0) {
              that.setData({
                ['polyline[0].points']: b,
              })
            }
          });

      }, 2000) //延迟时间 这里是2秒
      setTimeout(function () {
        that.getmyLine();
      }, 2100)
      if (that.data.setDesAddress != that.data.desAddress) {
        that.setRecord();
        that.setData({ setDesAddress: that.data.desAddress })
      }
    }
  },

  //跳转到选择上车点页面的方法
  chooseAddress: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  //map组件上的controls图标的事件触发
  controltap(e) {
    var that = this
    var id = e.controlId

    if (id == 1) {
      if (that.data.myLatitude == "" || that.data.myLongitude == "") {
        wx.showToast({
          title: '请打开位置信息',
          image: '../images/fail.png'
        })
      } else {
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            that.setData({
              lookLatitude: res.latitude,
              lookLongitude: res.longitude,
              scale: "25"
            })

          }
        })
      }
    }
    if (id == 2 && that.data.busLatitude != "") {
      that.setData({
        lookLatitude: that.data.busLatitude,
        lookLongitude: that.data.busLongitude,
        scale: "25"
      })
    }
    if (id == 3) {
      if (that.data.desLatitude == "1" || that.data.desLongitude == "1") {
        wx.showToast({
          title: '请先选择上车点',
          image: '../images/fail.png'
        })
      } else {
        that.setData({
          lookLatitude: that.data.desLatitude,
          lookLongitude: that.data.desLongitude,
          scale: "25"
        })
      }
    }
  }

})