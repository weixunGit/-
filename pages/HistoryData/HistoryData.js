const app = getApp()

Page({
  data: {
    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    contentlist: [], // 列表显示的数据源
    allPages: '',    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    loadMoreData: '',
    record: {},
    ExitRecord:false,
    windowHeight:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var date = new Date();
    // this.setData({
    //   refreshTime: date.toLocaleTimeString()
    // })
    // this.getData();
  },

  getPhoneSize: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },

  onShow: function () {
    var that = this
    wx.request({
      url: 'http://111.230.35.130:8080/WebSocketDemo/Record',
      data: {
        way: "get",
        phone: app.globalData.phoneNum
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data!=null&&res.data.length>0){
          that.setData({ 
            record: res.data,
            ExitRecord:true
          })
        }
        console.log("data里的record：" + that.data.record[0])
        console.log(that.data.ExitRecord)
      },
      fail: function (res) {
        console.log(".....getRecord fail.....");
      }
    })
  },

  // 上拉加载更多
  loadMore: function () {
    var self = this;
    // 当前页是最后一页
    if (self.data.currentPage == self.data.allPages) {
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = self.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        currentPage: tempCurrentPage,
        hideBottom: false,
        // loadMoreData:"加载更多..."
      })
      // self.getData();
    }, 1000);

  },
  // 下拉刷新
  // refresh: function (e) {
  //   var self = this;
  //   setTimeout(function () {
  //     console.log('下拉刷新');
  //     var date = new Date();
  //     self.setData({
  //       currentPage: 1,
  //       refreshTime: date.toLocaleTimeString(),
  //       hideHeader: false
  //     })
  //     self.getData();
  //   }, 300);
  // },
  // 获取数据  pageIndex：页码参数
  // getData: function () {
  //   var self = this;
  //   var pageIndex = self.data.currentPage;
  //   wx.request({
  //     url: 'https://route.showapi.com/582-2',
  //     data: {
  //       showapi_appid: '19297',
  //       showapi_sign: 'cf606a68a01f45d196b0061a1046b5b3',
  //       page: pageIndex
  //     },
  //     success: function (res) {
  //       var dataModel = res.data;
  //       if (dataModel.showapi_res_code == 0) {
  //         if (dataModel.showapi_res_body.ret_code == 0) {
  //           if (pageIndex == 1) { // 下拉刷新
  //             self.setData({
  //               allPages: dataModel.showapi_res_body.pagebean.allPages,
  //               contentlist: dataModel.showapi_res_body.pagebean.contentlist,
  //               hideHeader: true
  //             })
  //           } else { // 加载更多
  //             console.log('加载更多');
  //             var tempArray = self.data.contentlist;
  //             tempArray = tempArray.concat(dataModel.showapi_res_body.pagebean.contentlist);
  //             self.setData({
  //               allPages: dataModel.showapi_res_body.pagebean.allPages,
  //               contentlist: tempArray,
  //               hideBottom: true
  //             })
  //           }
  //         }
  //       }
  //     },
  //     fail: function () {

  //     }
  //   })
  // },
})