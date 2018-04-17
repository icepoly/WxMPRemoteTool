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
    
    onPullDownRefresh:function(){
      this.getTaskInfo()
    },

    getFuncName: function(type, optype){
      if(type === 1){
        if(optype == 1){
          return '签到'
        }
        else if(optype == 2){
          return '签退'
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

    getMsg: function(opdata){
      var tempdata = opdata.replace(new RegExp(/\'/g),"\"")
      tempdata = tempdata.replace(new RegExp(/{/g),"{\"")
      tempdata = tempdata.replace(new RegExp(/,/g),",\"")
      tempdata = tempdata.replace(new RegExp(/:/g),"\":")
      try{
        var data = JSON.parse(tempdata)
        return data.actionType
      }
      catch(err){
        return opdata
      }
    },

    getTaskInfo: function () {
      util.showBusy('请求中...')
      var that = this

      var options = {
        url: config.service.taskUrl,
        success(result) {
          wx.stopPullDownRefresh()
          var info = {}
          info.name = that.getFuncName(result.data.type, result.data.optype)
          info.state = that.getState(result.data.state)
          info.msg = that.getMsg(result.data.opdata)
          that.setData({
            taskInfo: info,
          })
          wx.hideToast();
        },
        fail(error) {
          util.showError(error);
        }
      }
      qcloud.request(options)
    }
})
