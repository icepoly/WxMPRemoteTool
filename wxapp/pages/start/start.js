//login.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    logged: false
  },

  goToIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  onLoad:function(){
    var that = this
    this.login()
  },

  onShow:function(){

  },

  onReady: function(){
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  },

  login: function () {
    if (this.data.logged) return

    var that = this
    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },

            fail(error) {
              wx.showError(error)
            }
          })
        }
      },

      fail(error) {
        wx.showError(error)
      }
    })
  }
});