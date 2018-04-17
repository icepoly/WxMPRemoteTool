//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    getTaskInfo: function () {
      util.showBusy('请求中...')
      var that = this

      var options = {
        url: config.service.taskUrl,
        success(result) {
          console.log(result.data)
        },
        fail(error) {
          util.showError(error);
        }
      }
      qcloud.request(options)
    }
})
