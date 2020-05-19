import Vue from "vue";
import Router from "vue-router";
// import Login from './views/login/index.vue'
//下面情况，默认导入'./views/login/index.vue'
import Login from './views/login'
import Loyout from '@/components/Loyout.vue'
import Home from '@/views/home'
import Goods from '@/views/goods'
import Member from '@/views/member'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'
Vue.use(Router);

export default new Router({
  routes:[
    //登录页
    {
      path:'/login',
      name:'login',//路由名称
      component:Login//组件对象
    },
    //基础布局
    {
      path:'/',
      name:'loyout',//路由名称
      component:Loyout,//组件对象
      redirect: '/home',// 重定向到子路由
      children:[
        {
          path:'/home',
          name:'Home',
          component:Home
        }
      ]
    },
    {
      path:'/member',
      component:Loyout,//组件对象
      children:[
        {
          path:'/',
          component:Member,
          meta: { title: '会员管理' }
        }
      ]
    },
    {
      path:'/supplier',
      component:Loyout,//组件对象
      children:[
        {
          path:'/',
          component:Supplier,
          meta: { title: '供应商管理' }
        }
      ]
    },
    {
      path:'/goods',
      component:Loyout,//组件对象
      children:[
        {
          path:'/',
          component:Goods,
          meta: { title: '商品管理' }
        }
      ]
    },
    {
      path:'/staff',
      component:Loyout,//组件对象
      children:[
        {
          path:'/',
          component:Staff,
          meta: { title: '员工管理' }
        }
      ]
    }
  ]
});
