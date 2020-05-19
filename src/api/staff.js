import request from '@/utils/request'

export default {
    //分页获取列表
    search(page,size,searchMap){
        return request({
            url:`/staff/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    add(pojo){
        return request({
            url:'/staff',
            method:'post',
            data:pojo
        })
    },
    getById(id){
        return request({
            url:`/staff/${id}`,
            method:'get'
        })
    },
    update(pojo) {
            return request({
              url: `/staff/${pojo.id}`, // 反单引号 ``
              method: 'put', // put 方式提交
              data: pojo
           })
    },
    deleteById(id) {
            return request({
              url: `/staff/${id}`,  // 反单引号 ``
              method: 'delete', // delete 方式提交
           })
    }
}