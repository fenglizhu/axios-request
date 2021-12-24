
import $axios from "./$axios";

/**
 * get请求
 * @param { string } url 接口路径     必传
 * @param { Object } params 接口参数  可选
 * @param { Object } config 接口配置  可选
 * @returns 返回一个promise 对象
 */
const get = ({ url = '', params = {}, config = {} })=> {
  return new Promise((resolve,reject)=>{
    $axios.get(url, {
      params,
      ...config
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * post请求
 * @param { String } url 接口路径     必传
 * @param { Object } data 接口参数    可选
 * @param { Object } config 接口配置  可选
 * @returns 
 */
const post = ({
  url, 
  data = {}, 
  config = {
    headers: { 
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
})=> {
  return new Promise((resolve,reject)=>{
    $axios.post(url, data,{
      ...config
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * patch请求，更新局部资源
 * @param { String } url 接口路径     必传
 * @param { Object } data 接口参数    可选
 * @param { Object } config 接口配置  可选
 * @returns 
 */
const patch = ({ url, data = {}, config = {}})=> {
  return new Promise((resolve,reject)=>{
    $axios.patch(url, data,{
      ...config
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * put请求，更新全局资源
 * @param { String } url 接口路径     必传
 * @param { Object } data 接口参数    可选
 * @param { Object } config 接口配置  可选
 * @returns 
 */
const put = ({ url, data = {}, config = {}})=> {
  return new Promise((resolve,reject)=>{
    $axios.put(url, data,{
      ...config
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * delete请求
 * @param { String } url 接口路径     必传
 * @param { Object } data 接口参数    可选
 * @param { Object } config 接口配置  可选
 * @returns 
 */
const deleteA = ({ url, data = {}, config = {}})=> {
  return new Promise((resolve,reject)=>{
    $axios.put(url, data,{
      ...config
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}

export {
  get,
  post,
  patch,
  put,
  deleteA
}