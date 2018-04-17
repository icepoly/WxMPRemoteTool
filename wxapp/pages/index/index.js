//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        takeSession: false,
    },
    
    doCheckIn: function()
    {
      var that = this
      var jsondata = {}
      jsondata.type = 1
      jsondata.optype = 1
      jsondata.opdata = "checkin"
      this.setData({
        takedata: jsondata
      })
      this.doRequestWithSession()
    },

    doCheckOut: function () {
      var that = this
      var jsondata = {}
      jsondata.type = 1
      jsondata.optype = 2
      jsondata.opdata = "checkout"
      this.setData({
        takedata: jsondata
      })
      this.doRequestWithSession()
    },

    doRequestWithSession: function () {
        util.showBusy('请求中...')
        var that = this

        var options = {
            url: config.service.taskUrl,
            data: that.data.takedata,
            header: {
              "Content-Type": "application/json"
            },
            method: "POST",
            success (result) {
              util.showState(result.data)
            },
            fail (error) {
              wx.showError(error)
            }
        }
        qcloud.request(options)
    }
})
