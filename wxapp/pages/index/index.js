//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
    },

    // 用户登录示例
    login: function() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this
        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                  util.showSuccess('登录成功', result)
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
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
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
                console.log('request success', result)
                util.showModel('请求成功完成', JSON.stringify(result.data));
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        qcloud.request(options)
    },

    getTaskInfo: function () {
      util.showBusy('请求中...')
      var that = this

      var options = {
        url: config.service.taskUrl,
        success(result) {
          console.log('request success', result)
          util.showModel('请求成功完成', JSON.stringify(result.data));
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      qcloud.request(options)
    }
})
