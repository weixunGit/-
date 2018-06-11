// 检测是否有输入  
function checkIsNotNull(content) {
  if(content==""){
    return false
  }else{
    return true
  }
}

// 检测输入内容  
function checkPhoneNum(phoneNum) {
  console.log(phoneNum)
  let str = /^1\d{10}$/
  if (!checkIsNotNull(phoneNum)) {
    return false
  }else{
    if (str.test(phoneNum)) {
      return true
    } else {
      return false
    }
  }
}
function checkPassword(pass,rePass) {
  let str = /^[A-Za-z0-9]{6,15}$/
  if (str.test(pass) && str.test(rePass)) {
      return true
    } else {
      wx.showToast({
        title: '密码格式不对',
        image: '../images/fail.png',
      })
      return false
    }
}

// 比较两个内容是否相等  
function isContentEqual(content_1, content_2) {
  if (!checkIsNotNull(content_1)) {
    return false
  }

  if (content_1 === content_2) {
    return true
  }
}

module.exports = {
  checkIsNotNull: checkIsNotNull,
  checkPhoneNum: checkPhoneNum,
  isContentEqual: isContentEqual,
  checkPassword: checkPassword
}  