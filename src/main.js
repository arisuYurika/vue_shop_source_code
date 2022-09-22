import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入 element-UI 样式库
import './plugins/element.js'

//导入自定义全局样式表
import './assets/css/global.css'

//导入阿里 icon 库
import './assets/fonts/iconfont.css'

// 导入第三方 Table-Tree 组件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

//导入 axios
import axios from 'axios'

// import { config } from 'vue/types/umd'


//为axios设置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截
axios.interceptors.request.use(config => {
    // 为请求头对象，添加Token验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

//将方法放入vue的prototype中 这样每个 this 都可以直接访问到 $http ,从而发起 ajax 请求
Vue.prototype.$http = axios;



Vue.config.productionTip = false;

// 声明（new）了Vue的实例对象
new Vue({
    router, // 挂载路由 index.js
    render: h => h(App) // 通过render函数，将App.vue根组件渲染到了index.html首页中

}).$mount('#app'); // 通过$mount方法，将实例挂载到了id：app所在的区域中（即index.html中）



// 该文件为打包入口文件