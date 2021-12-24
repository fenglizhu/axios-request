/**
 * 定义处理错误信息类
 */
class AxiosExption {
  constructor() {
    this.NetWorkKey = {
      SERVER_REJECT: '服务器拒绝访问',
      NO_AUTHORIZATION: '没有提供授权信息',
      NO_AUTHORITY: '没有权限访问',
      NO_FIND: '接口路径错误',
      NETWORK_ERROR: '网络错误',
      TIMEOUT: '请求超时',
      SERVER_ERROR: '服务器出错',
      CANCELED: '请求已取消'
    }
  }

  /**
   * 设置请求错误信息
   * @param {*} error 
   * @returns 返回一个错误信息字符串
   */
  setErrorMsg(error) {
    let errorMsg = '请求发生错误';
    if (/400$/.test(error)) {
      errorMsg = this.NetWorkKey.SERVER_REJECT
    }
    if (/401$/.test(error)) {
      errorMsg = this.NetWorkKey.NO_AUTHORIZATION
    } 
    if (/403$/.test(error)) {
      errorMsg = this.NetWorkKey.NO_AUTHORITY
    }
    if (/404$/.test(error)) {
      errorMsg = this.NetWorkKey.NO_FIND
    }
    if (/Network Error$/.test(error)) {
      errorMsg = this.NetWorkKey.NETWORK_ERROR;
    }
    if (/timeout/.test(error)) {
      errorMsg = this.NetWorkKey.TIMEOUT;
    }
    if(/502$/.test(error)) {
      errorMsg = this.NetWorkKey.SERVER_ERROR;
    }
    if(/cancel/.test(error)) {
      errorMsg = this.NetWorkKey.CANCELED;
    }
    return errorMsg;
  }

  /**
   * 判断接口不存在
   * @param {*} error 
   * @returns 
   */
  static netWork404 (error) {
    return /400$/.test(error)
  }
}

export {
  AxiosExption
}