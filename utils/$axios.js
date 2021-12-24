import axios from 'axios';
import { AxiosExption } from './AxiosExption'

// 使用由库提供的配置的默认值来创建实例
const $axios = axios.create({
  timeout: 10000, // 设置请求超时时间
  baseURL: 'https://www.zhufengli.com/api'
});

let urlArray = []
/**
 * 添加请求拦截器
 */
$axios.interceptors.request.use((config) => {
  // 在发送请求之前，如有需要，带上token
  let token = localStorage.getItem('token')
  config.headers.Authorization = token || '';

  // 使用 CancelToken.source 工厂方法创建 cancel token
  let canToken = axios.CancelToken;
  let source = canToken.source();

  // 需要在 config 配置项新增属性 cancelToken
  config.cancelToken = source.token;

  // 获取完整的请求路径
  let urlKey = getUrl(config)

  // 相同请求就取消
  removeSameRequest(urlKey);

  // 每发起一次请求就把url拼上参数添加进去
  urlArray.push({urlKey, source})

  return config;
}, function (error) {
  // 抛出错误
  return Promise.reject(error);
});

/**
 * 拦截响应
 */
$axios.interceptors.response.use(
  (response) => {
    // 请求完成之后需要移除
    let urlKey = getUrl(response.config)
    removeSameRequest(urlKey);
    return response.data;
  },
  (error) => {
    // 处理错误信息
    let errorMsg = new AxiosExption().setErrorMsg(error);
    error.errorMsg = errorMsg;
    return Promise.reject(error);
  }
);

/**
 * 获取请求的完整路径
 * @param {*} config 
 * @returns 
 */
const getUrl = (config) => {
  let { baseURL, url } = config;
  let urlKey = `${baseURL}${url}`;
  if(config.method == 'get') {
    urlKey += `_${JSON.stringify(config.params)}`
  } else {
    urlKey += `_${JSON.stringify(config.data)}`
  }
  return urlKey
}

/**
 * 移除相同的请求
 * @param {*} urlKey 请求url
 */
let removeSameRequest = (urlKey) => {
  // 检测是否有相同的请求未取消
  for(let i = 0; i < urlArray.length; i ++) {
    let item = urlArray[i];
    if (item.urlKey == urlKey && item.source) {
      item.source.cancel('cancel');
      // 同时移除旧的请求
      urlArray.splice(i, 1);
      break;
    }
  }
}

export default $axios

