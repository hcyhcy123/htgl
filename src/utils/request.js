import axios from 'axios'
import { Loading,Message } from 'element-ui';

const loading = {
    loadingInstance:null,    //loading实例
    // 打开加载
    open:function(){
        // 创建实例，而且会打开加载窗口
        if(this.loadingInstance === null){
            this.loadingInstance = Loading.service({
                text: '拼命加载中',
                target: '.main', // 效果显示区域
                background: 'rgba(0, 0, 0, 0.5)' // 加载效果
            })
        }
    },
    // 关闭加载
    close:function(){
        // 不为null时，关闭加载窗口
        if(this.loadingInstance !== null){
            this.loadingInstance.close()
            console.log('结束加载')
        }
        this.loadingInstance=null
    }
}

const request = axios.create({
    // 根据不同环境设置 baseURL, 最终发送请求时的URL为: baseURL + 发送请求时写URL ,
  // 比如 get('/test'), 最终发送请求是: /dev-api/test
  // baseURL: '/dev-api',
  // baseURL: '/',
  // 根目录下的 .env.development 与 .env.production 中配置 VUE_APP_BASE_API
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000    //请求超时
})

//请求拦截器
request.interceptors.request.use(config => {
    //请求拦截
    loading.open()
    return config
},error => {
    // 关闭加载
    loading.close()
    //出现异常
    return Promise.reject(error)
})
//响应拦截器
request.interceptors.response.use(response => {
    // 关闭加载
    loading.close()
    const resp = response.data
    // 如果后台响应状态码不是 2000 , 说明后台服务有异常,统一可在此处处理
    if(resp.code !== 2000){
        Message({
            message:resp.message || '系统异常',
            type:'warning',
            duration:5 * 1000   //停留时长
        })
    }
    return response
},error => {
    // 关闭加载
    loading.close()
     // 当请求接口出错时, 进行弹出错误提示, 如 404, 500, 请求超时
    console.log('response error',error.response.status)
    Message({
        message:error.message,
        type:'error',
        duration:5 * 1000   //停留时长
    })
    return Promise.reject(error);
})


export default request  //导出自定义创建的axios对象