var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconType: "success",
    aboardDestination: "请在下方选择",
    aboardLat: "123",
    aboardLon: "123",
    WestchangeChooseBind: "",
    MidchangeChooseBind: "",
    EastchangeChooseBind: "",
    WestTitleViewStyle: "30px",
    WestAddressViewOpacity: "0",
    EastTitleViewStyle: "30px",
    EastAddressViewOpacity: "0",
    MidTitleViewStyle: "30px",
    MidAddressViewOpacity: "0",
    westAddress: [
      { name: '西区综合楼', lat: '23.628941', lon: '113.677769', checked: '0' },
      { name: '西学楼6号', lat: '23.630887', lon: '113.676776', checked: '0' },
      { name: '西学楼7号', lat: '23.630450', lon: '113.676991', checked: '0' },
      { name: '西学楼8号', lat: '23.629983', lon: '113.677216', checked: '0' },
      { name: '西学楼9号', lat: '23.629526', lon: '113.677431', checked: '0' },
      { name: '西学楼10号', lat: '23.629068', lon: '113.677629', checked: '0' },
      { name: '西学楼11号', lat: '23.628631', lon: '113.677838', checked: '0' },
    ],
    midAddress: [
      { name: '中区饭堂前门', lat: '23.634642', lon: '113.679040', checked: '0' },
      { name: '中区饭堂后门', lat: '23.635045', lon: '113.679453', checked: '0' },
      { name: '音乐楼', lat: '23.635192', lon: '113.678600', checked: '0' },
      { name: '孙中山铜像', lat: '23.634342', lon: '113.677104', checked: '0' },
    ],
    eastAddress: [
      { name: '中山大学南方学院东区饭堂', lat: '23.633963', lon: '113.681620', checked: '0' },
      { name: '中山大学南方学院东区体育馆', lat: '23.633670', lon: '113.681360', checked: '0' },
      { name: '东19', lat: '23.633565', lon: '113.682956', checked: '0' },
    ]

  },

  showAddress: function (e) {
    var area = e.currentTarget.id;
    // console.log(area);
    var that = this;

    if (area == "mid") {
      var style = that.data.MidTitleViewStyle;
      var opacity = that.data.MidAddressViewOpacity;
      if (style == "30px" && opacity == "0") {
        that.setData({ MidTitleViewStyle: "100%" })
        that.setData({ MidAddressViewOpacity: "1" })
        that.setData({ MidchangeChooseBind: "changeChoose" })
      } else {
        that.setData({ MidTitleViewStyle: "30px" })
        that.setData({ MidAddressViewOpacity: "0" })
        that.setData({ MidchangeChooseBind: "" })
      }
    }
    if (area == "west") {
      var style = that.data.WestTitleViewStyle;
      var opacity = that.data.WestAddressViewOpacity;
      if (style == "30px" && opacity == "0") {
        that.setData({ WestTitleViewStyle: "100%" })
        that.setData({ WestAddressViewOpacity: "1" })
        that.setData({ WestchangeChooseBind: "changeChoose" })
      } else {
        that.setData({ WestTitleViewStyle: "30px" })
        that.setData({ WestAddressViewOpacity: "0" })
        that.setData({ WestchangeChooseBind: "" })
      }
    }
    if (area == "east") {
      var style = that.data.EastTitleViewStyle;
      var opacity = that.data.EastAddressViewOpacity;
      if (style == "30px" && opacity == "0") {
        that.setData({ EastTitleViewStyle: "100%" })
        that.setData({ EastAddressViewOpacity: "1" })
        that.setData({ EastchangeChooseBind: "changeChoose" })
      } else {
        that.setData({ EastTitleViewStyle: "30px" })
        that.setData({ EastAddressViewOpacity: "0" })
        that.setData({ EastchangeChooseBind: "" })
      }
    }
  },

  changeChoose: function (options) {
    var area = options.currentTarget.id;
    // console.log(options.target.dataset.index);
    var index = options.target.dataset.index;
    // console.log(area+index)
    var that = this;
    that.clearIcon();
    var changed = {};

    if (area == "westIcon") {
      changed['westAddress[' + index + '].checked'] = "1"
      that.setData({ aboardDestination: that.data.westAddress[index].name })
      that.setData({ aboardLat: that.data.westAddress[index].lat })
      that.setData({ aboardLon: that.data.westAddress[index].lon })
    }
    if (area == "midIcon") {
      changed['midAddress[' + index + '].checked'] = "1"
      that.setData({ aboardDestination: that.data.midAddress[index].name })
      that.setData({ aboardLat: that.data.midAddress[index].lat })
      that.setData({ aboardLon: that.data.midAddress[index].lon })
    }
    if (area == "eastIcon") {
      changed['eastAddress[' + index + '].checked'] = "1"
      that.setData({ aboardDestination: that.data.eastAddress[index].name })
      that.setData({ aboardLat: that.data.eastAddress[index].lat })
      that.setData({ aboardLon: that.data.eastAddress[index].lon })
    }
    that.setData(changed)
  },

  clearIcon: function () {
    var that = this;
    var west = that.data.westAddress;
    var mid = that.data.midAddress;
    var east = that.data.eastAddress;
    var changed = {};
    // console.log(west.length)

    for (var i = 0; i < west.length; i++) {
      changed['westAddress[' + i + '].checked'] = "0"
    }
    for (var i = 0; i < mid.length; i++) {
      changed['midAddress[' + i + '].checked'] = "0"
    }
    for (var i = 0; i < east.length; i++) {
      changed['eastAddress[' + i + '].checked'] = "0"
    }
    that.setData(changed)
  },

  getAddress: function () {
    var that = this
    if (that.data.aboardDestination !="请在下方选择"){
    app.myData.aboardDestination = that.data.aboardDestination,
    app.myData.aboardLat = that.data.aboardLat,
    app.myData.aboardLon = that.data.aboardLon

    wx.switchTab({
      url: "../index/index"
    })
    }else{
      wx.showToast({
        title: '请先选择上车点',
      })
    }
  },
})