
做过 `vue` 项目的都应该知道 `axios` ，Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

### 特性

- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF

### 兼容性

![image.png](https://s2.loli.net/2022/01/04/LOpsw7oVT8cCmMS.png)

总之呢，大部分的浏览器都是支持的

### 安装

```
npm install axios
```

### 使用

一般情况下，我们是这样使用，基本上一个项目中，需要用到请求的是全局的，所以我们可以注册一个全局变量使用

在main.js挂一个全局变量
```
import axios from 'axios'
Vue.prototype.$axios = axios
```

然后我们在home页面就可以使用`this.$axios.方法`，比如，我们演示一下 `get` 方法：

```
this.$axios.get('url',
params:{
    user: 'zhufengli'
}).then(res=>{
    // params 就是你的参数
    // 正确处理
}).catch(err=>{
    // 错误处理
})
```

这样当然没问题，但是，如果你的项目庞大，每次都要写很多这种不好维护的代码。

### 全局封装

新建 `$axios.js` 文件

```
import axios from 'axios';
import { HttpExption } from './AxiosExption'

// 使用由库提供的配置的默认值来创建实例
const $axios = axios.create({
  timeout: 10000, // 全局设置请求超时时间
  baseURL: process.env.VUE_APP_BASE_API, // 基本路径
});

/**
 * 添加请求拦截器
 */
$axios.interceptors.request.use((config) => {
  // 在发送请求之前，如有需要，带上token
  let token = localStorage.getItem('token')
  config.headers.Authorization = token || '';
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
    return response.data;
  },
  (error) => {
    // 处理错误信息
    let errorMsg = new HttpExption().setErrorMsg(error);
    error.errorMsg = errorMsg;
    return Promise.reject(error);
  }
);

export default $axios

```

关于`process.env.VUE_APP_BASE_API`如何配置，我的另一篇文章[Vue CLI模式和环境变量的配置](https://note.youdao.com/)，可以解开你的疑惑。[坏笑]对，我故意的，想让你学更多东西。

### 错误信息类封装

直接上代码，这里面的一下请求错误信息，都是我做项目过程中经常遇到的请求错误，最后一个`CANCELED`是取消请求自定义的，下面有介绍。

```
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
}

export {
  AxiosExption
}
```

可以看到我在错误信息处理这里，给error新增了一个errorMsg的属性，主要是可以作为错误提示，就不需要你一个一个去判断，而且error.message返回的是英文，你提示英文，显然可以看出你没有做处理

```
let errorMsg = new HttpExption().setErrorMsg(error);
error.errorMsg = errorMsg;
return Promise.reject(error);
```

到这呢，你就可以这样引入，因为我是放在utils文件夹下面

```
import $axios from './utils/$axios'
```

以上，还不够方便，因为你还是要使用`this.$axios.方法`来请求接口

### 方法封装

#### GET

先来封装`get`请求，`get`请求比较特殊的是它的参数是放在`params`里面。

```
// 引入你刚刚写好的$axios
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
```
这个config，就是请求的配置，你可以为单个请求设置不一样的配置，跨域、请求头配置、对原生事件的处理等，具体可以看看 [官网](http://www.axios-js.com/zh-cn/docs/#axios-spread-callback) 给出的配置，可配项还是挺多的。

#### POST

接下来就是经常用到的 `post`请求，post所有的参数都是放在 `data` 里面

```
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
    $axios.post(url, data, {
      ...config
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}
```

#### PATCH/PUT

这两个方法呢，可能用的比较少，都是修改资源的请求方法，不一样的是：`patch`是更新局部资源，`put`是全部资源更新，也就是说如果使用put方法的话，需要传一个整的数据给接口，否则，缺掉的部分应该被清空。

```
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
```

#### DELETE

删除数据方法

```
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
```

完了之后呢，全部导出

```
export {
  get,
  post,
  patch,
  put,
  deleteA
}
```

但你使用的时候可以在统一的请求文件模块来做这个处理，比如： 

`request/index.js`

```
import { get } from '../utils/AxiosRequest'

const getUserInfo = (params) =>{
  return new Promise((resolve,reject) =>{
    get({
      url:'detail/info',
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
```

页面使用


```
import {  getUserInfo } from '../request'

export default {
  mounted() {
    getUserInfo({
      user:'zhufenli'
    }).then(res=>{
      console.log(res);
    }).catch(error=>{
      console.log(error);
    })
  }
}
```
看一下能不能打印出来信息，哈哈，这个是我测试的一个接口，总归，有信息回来了

![image.png](https://s2.loli.net/2021/12/14/9IRhSx2sluJ8jB7.png)

现在我故意写错接口的url会怎么样，看看能不能返回我们在上面定义的“404”状态的“接口路径错误”，耶！有了。。。

![image.png](https://s2.loli.net/2021/12/14/FLSokvVZEd3P1QA.png)

### 全局取消请求

为什么要做取消请求，比如用户狂点某个按钮来查询数据，很多人想到防抖来处理，当然也是可以的。这个取消请求在哪里处理呢？想到全局，你可能说在某个封装的方法中处理，但是方法还几个，没必要写太多相同代码。

所以，我们可以在请求拦截器里面处理。基本步骤：
- 使用 `CancelToken.source` 工厂方法创建 `cancel token` 资源 `source`
- 在 `config` 配置里面添加`cancelToken: source.token`
- 取消请求 `source.cancel('cancel')`;

我们来改造统一处理一下，直接上代码

```
let urlArray = []
/**
 * 添加请求拦截器
 */
$axios.interceptors.request.use((config) => {
  ...

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
    let urlKey = getUrl(response.config);
    removeSameRequest(urlKey);
    return response.data;
  },
  (error) => {
    ...
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
```

我这里是把参数转成字符串`JSON.stringify(config.params)`，有时候数据太多了，还有嵌套，如果一层一层遍历对应 `key:value`, 需要写个递归函数，也是可以的，具体可以根据自己的项目情况而定。

接下来我们测试一下，写个按钮，给它点击事件，狂点！！！

```
<button @click="search">查询数据</button>
...
methods:{
    search() {
      getUserInfo({
        user:'zhufenli'
      }).then(res=>{
        console.log(res);
      }).catch(error=>{
        console.log(error);
      })
    },
}
```

把网络调成3G，看下效果，可以看到相同的请求都取消了

![image.png](https://s2.loli.net/2021/12/15/pswqxlbS9XyKdG1.png)

完结撒花！！！

