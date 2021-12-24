import { get } from '../../utils/AxiosRequest'

const getUserInfo = (params) =>{
  return new Promise((resolve,reject) =>{
    get({
      url:'/userinfo',
      params
    }).then(result=>{
      resolve(result);
    }).catch(error=>{
      reject(error.errorMsg);
    })
  })
}

export {
  getUserInfo
}