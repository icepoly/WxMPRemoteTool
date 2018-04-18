const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showError = (error) => {
    wx.hideToast();
    wx.hideLoading();
    wx.showModal({
        title : '错误',
        content: error,
        showCancel: false
    })
}

var showState= (state) => {
  wx.hideToast();
  wx.hideLoading();
  if (state == 1){
    showSuccess('成功');
  }
  else
  {
    var error = 'error'
    if (typeof(state) == 'number'){
      var errorIdStr = state.toString(16);
      errorIdStr = errorIdStr.substr(errorIdStr.length-2)
      if (errorIdStr == 'ff') {
        error = '数据库发生系统错误'
      } else if(errorIdStr == 'f0'){
        error = '数据库获取数据发生'
      } else if(errorIdStr == 'e0'){
        error = '数据库更新发生错误'
      }
    }
    else
    {
      if (typeof(state) == 'object'){
        if(JSON.stringify(state.data) != "{}"){
          error = JSON.stringify(state.data)
        }
      }
      else if (typeof(state) == 'string'){
        error = state
      }
    }
    wx.showModal({
      title: '错误',
      content: error,
      showCancel: false
    })
  }
}

module.exports = { formatTime, showBusy, showSuccess, showError, showState }
