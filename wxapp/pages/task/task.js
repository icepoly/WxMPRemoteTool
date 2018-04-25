//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
    },
    onLoad:function(){
      var that = this
      this.getTaskInfo()
    },
    
    onShow: function () {
      var that = this
      this.getTaskInfo()
    },

    onPullDownRefresh:function(){
      wx.showNavigationBarLoading()
      this.getTaskInfo()
    },

    getFuncName: function(type, optype){
      if(type === 0){
        if(optype == 0){
          return '签到'
        }
        else if(optype == 1){
          return '签退'
        }
      }
      else if(type === 1){
        if (optype == 0) {
          return '服务器打包'
        }
        else if (optype == 1) {
          return '客户端打包'
        }
      }
    },

    getState: function(state){
      if(state == 1){
        return '等待接受'
      }
      else if(state == 2){
        return '接受任务'
      }
      else if(state == 0){
        return '执行完成'
      }
    },

    getTaskInfo: function () {
      util.showBusy('请求中...')
      var that = this

      var options = {
        url: config.service.taskUrl,
        success(result) {
          var info = {}
          info.name = that.getFuncName(result.data.type, result.data.optype)
          info.state = that.getState(result.data.state)
          info.msg = result.data.opdata
          info.time = result.data.time
          that.setData({
            taskInfo: info,
          })
          wx.hideToast();
          setTimeout(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
          }, 1500);
        },
        fail(error) {
          util.showError(error);
        }
      }
      qcloud.request(options)
    }
})
