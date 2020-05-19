import Vue from "vue";
import ElementUI from 'element-ui';//组件库
import 'element-ui/lib/theme-chalk/index.css'; // 样式
import App from "./App.vue";
import router from "./router";
import store from './store'

//使用ElementUI
Vue.use(ElementUI)
//权限拦截
import './permission'
// 消息提示的环境配置，是否为生产环境：
// false 开发环境：Vue会提供很多警告来方便调试代码。
// true 生产环境：警告却没有用，反而会增加应用的体积
Vue.config.productionTip = process.env.NODE_ENV === 'production';

new Vue({
  router,
  store,//注册
  render: h => h(App)
}).$mount("#app");
