//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        buildGroup:["服务器", "客户端"],
        buildType:'请选择',
        buildTypeIndex:0,
        buildName:"",
        showExecBtn:false
    },
    
    doCheckIn: function()
    {
      var that = this
      var jsondata = {}
      jsondata.type = 0
      jsondata.optype = 0
      jsondata.opdata = "checkin"
      this.setData({
        takedata: jsondata
      })
      this.doRequestWithSession()
    },

    doCheckOut: function () {
      var that = this
      var jsondata = {}
      jsondata.type = 0
      jsondata.optype = 1
      jsondata.opdata = "checkout"
      this.setData({
        takedata: jsondata
      })
      this.doRequestWithSession()
    },
    doBuild: function()
    {
      var that = this
      if(that.data.showExecBtn){
        var jsondata = {}
        jsondata.type = 1
        jsondata.optype = that.data.buildTypeIndex
        jsondata.opdata = that.data.buildName
        console.log(jsondata)
        this.setData({
          takedata: jsondata
        })
        this.doRequestWithSession()
        this.setData({
          buildType:'请选择',
          buildTypeIndex:0,
          buildName:'',
          showExecBtn:false
        })
      }
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
              util.showError(error)
            }
        }
        qcloud.request(options)
    },

    updateShowExecBtn:function(){
      var that = this
      this.setData({
        showExecBtn:(that.data.buildName != '' && that.buildType != '请选择')? true: false,
      })
    },

    bindPickerBuildGourpChange:function(event){
      var that = this
      var buildType = that.data.buildGroup[event.detail.value];
      this.setData({
        buildType:buildType,
        buildTypeIndex:event.detail.value,
      })
      this.updateShowExecBtn()
    },

    bindNameInput:function(event){
      var that = this
      this.setData({
        buildName:event.detail.value,
      })
      this.updateShowExecBtn()
    },
})
