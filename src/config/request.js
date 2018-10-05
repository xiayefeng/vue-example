import {Notification} from 'element-ui'
import axios from 'axios'
import queryString from 'query-string'


axios.defaults.withCredentials = true
const instance = axios.create({
  timeout: 25000 // 请求超时时间
})
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
instance.interceptors.request.use((config) => {
  if (config.isPlain) {
    config.data = queryString.stringify({csjson: JSON.stringify(config.data)})
  } else if (config.isFormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
    let formData = new FormData()
    let json = config.data
    for (let i in json) {
      if (json.hasOwnProperty(i)) {
        formData.append(i, json[i])
      }
    }
    config.data = formData
  }
  return config
}, error => Promise.reject(error))
instance.interceptors.response.use((resp) => {
  let res = resp.data
  return Promise.resolve(res)

}, error => {
  console.log(error)
  if (error.code === 'ECONNABORTED' || error.message.indexOf('Network') !== -1) {
    error.message = '网络不给力，请稍后再试'
  } else if (error.code === undefined) {
    error.message = '连接出错，请重试'
  }
  return Promise.reject(error)
})

export const http = ( {url = URL, type = 'get',params = {}, data = {}, isPlain = true, isFormData = false} = {}) => {
  // NProgress.start()
  // console.log(params)
  if (/[A-Z]/.test(type)) {
    type = type.toLocaleLowerCase()
  }
  return new Promise((resolve, reject) => {
    instance.request({url, params, data, isPlain, isFormData, method: type}).then((res) => {
      // NProgress.done()
      resolve(res)
      // NProgress.remove()
    }).catch(function (thrown) {
      console.log(thrown)
      if (axios.isCancel(thrown)) {
        console.log('canceled', thrown.message)
      }
      // NProgress.done()
      catchError(thrown)
      reject(thrown)
      // NProgress.remove()
    })
  })
}

export function upload (url, json, file) {

  let csjson = Object.assign({}, json, {uploadFile: file})
  return http(json, {url: url, type: 'post', data: csjson, isPlain: false, isFormData: true})
}

export default async (URL, data = {}, type = 'GET', method = 'fetch') => {
  let url
  type = type.toUpperCase()
  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })
   // let dataStr = queryString.stringify(data)

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = URL + '?' + dataStr
    }
  }
  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'force-cache'
    }
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    try {
      const response = await fetch(url, requestConfig)
      const responseJson = await response.json()
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      }
      let sendData = ''
      if (type === 'POST') {
        sendData = JSON.stringify(data)
      }
      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.send(sendData)
      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}

function errorToast (msg, dur = 2000, title = '错误') {
  Notification.error({
    title: title,
    message: msg,
    duration: dur
  })
}

function catchError (err = {}) {
  if (err.message) {
    errorToast(err.message)
  } else if (err.msg) {
    errorToast(err.msg)
  } else {
    errorToast(err)
  }
}
