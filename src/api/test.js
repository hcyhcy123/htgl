import request from '@/utils/request'

const BASE_URI = process.env.VUE_APP_BASE_API
// request.get('/db.json').then(response => {
//     console.log(response.data)
// })

//测试2.以对象配置的方式进行请求方式
request({
    method:'get',
    url:BASE_URI + '/db.json'
}).then(response => {
    console.log('get2',response.data)

})



export default {
    getList (){
        const req = request({
            method:'get',
            url:BASE_URI +  '/db.json'
        })
        return req
    }
}