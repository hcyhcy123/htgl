import {login,getUserInfo,logoout} from '@/api/login'
import {getToken,setToken,getUser,setUser,removeToken} from '@/utils/auth'

const user = {
    state:{
        token:getToken(),   //getToken()作为token初始值，解决页面刷新
        user:getUser()
    },

    mutations:{
        SET_TOKEN(state,token){
            state.token = token
            setToken(token)
        },
        SET_UESR(state,user){
            state.user = user
            setUser(user)
        }
    },

    actions:{
        // 登陆获取token
        Login({commit},form){
            // resolve触发成功处理,reject触发异常处理
            return new Promise((resolve,reject)=>{
                login(form.username.trim(),form.password).then(response => {
                    const resp = response.data
                    commit('SET_TOKEN',resp.data.token)
                    //通知组件已经将token更新成功
                    resolve(resp)
                }).catch(error=>{
                    reject(error)
                })
            })
            
        },

        // 通过token获取用户信息
        GetUserInfo({commit,state}){
            return new Promise((resolve,reject)=>{
                getUserInfo(state.token).then(response => {
                    const respUser = response.data
                    commit('SET_UESR',respUser.data)
                    resolve(respUser)
                }).catch(error=>{
                    reject(error)
                })
            })
        },
        // 退出
        Logout({commit,state}){
            return new Promise((resolve,reject) => {
                logoout(state.token).then(response => {
                    const resp = response.data
                    commit('SET_TOKEN','')
                    commit('SET_UESR',null)
                    removeToken()
                    resolve(resp)
                }).catch(error => {
                    reject(error)
                })
            })
        }

    }
}

export default user