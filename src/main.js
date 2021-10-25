import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入element-UI样式库
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入阿里icon
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'

//为axios设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //这样每个 this 都可以直接访问到 $http ,从而发起 ajax 请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({ // 声明（new）了Vue的实例对象
        router, // 将router路由挂载上去
        render: h => h(App) // 通过render函数，将App.vue根组件渲染到了index.html首页中

    }).$mount('#app') // 通过$mount方法，将实例挂载到了id：app所在的区域中


// 该文件为打包入口文件