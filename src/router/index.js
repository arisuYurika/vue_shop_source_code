import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/report/Reports.vue'

Vue.use(VueRouter)

// routes数组
const routes = [

    // 登录路由
    { path: '/', redirect: '/login' },

    // 登录路由 component属性定义要导向的组件
    { path: '/login', component: Login },

    // 父组件home 和子组件们
    {
        path: '/home',
        component: Home,
        // 进入 home 组件时自动跳转到 home/welcome
        redirect: '/home/welcome',
        // 子组件们
        children: [
            { path: '/home/welcome', component: Welcome },
            { path: '/home/users', component: Users },
            { path: '/home/rights', component: Rights },
            { path: '/home/Roles', component: Roles },
            { path: '/home/categories', component: Cate },

            { path: '/home/params', component: Params },
            { path: '/home/goods', component: Goods },
            { path: '/home/orders', component: Orders },
            { path: '/home/reports', component: Reports }
        ]
    }
]

const router = new VueRouter({
    routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();

    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) {
        alert('请登录！');
        return next('/login');
    }
    next();
})

export default router