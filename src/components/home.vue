<template>
    <div class="home-container">

        <!-- 盒子一号 -->
        <el-container class="home-container">

            <!-- 头部 -->
            <el-header>
                <div>
                    <img src="../assets/heima.png" alt="vue">
                    <span>后台管理系统</span>
                </div>
                <el-button type="danger" size="small" round @click="logout">退出登录</el-button>
            </el-header>

            <!-- 盒子二号 页面主体区域 -->
            <el-container>

                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '64px':'200px'">
                    <div class="toggle-button" @click="toggleCollapse">|||</div>
                    <!-- 侧边栏菜单区 -->
                    <el-menu 
                    class="el-menu-vertical-demo" 
                    background-color="RGB(252,234,241)" 
                    text-color="RGB(46,38,56)"
                        active-text-color="rgb(58, 178, 248)" 
                        :unique-opened="true" :collapse="isCollapse" 
                        :collapse-transition="false"
                        :router="true" :default-active="activePath">
                        <!-- submenu一级菜单 -->
                        <el-submenu :index="item.path" v-for="item in menulist" :key="item.id">
                            <!-- 一级菜单的内容渲染区域 -->
                            <template slot="title">
                                <!-- icon图标 -->
                                <i :class="iconObj[item.id]"></i>
                                <!-- 菜单文本 -->
                                <span>{{item.authName}}</span>
                            </template>

                            <!-- 二级菜单 -->
                            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
                                <template slot="title">
                                    <!-- icon图标 -->
                                    <i class="el-icon-menu"></i>
                                    <!-- 菜单文本 -->
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <!-- 盒子三号 -->
                <el-container>
                    <!-- 内容主体 -->
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                    <!-- 脚 -->
                    <el-footer>
                        是jiojio哦
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 左侧菜单数据
                menulist: [],

                // 使列表 icon 循环出不一样的样式的方法
                iconObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao',
                },

                isCollapse: false,

                // 被激活的链接地址
                activePath: ''
            }
        },
        //生命周期函数
        created() {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath')
        },

        methods: {
            //退出登录
            logout() {
                this.$confirm('即将退出登录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 清空session
                    window.sessionStorage.clear();
                    this.$message({
                        type: 'success',
                        message: '成功退出'
                    });
                    // 重定向到登录界面
                    this.$router.push("/login");
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消退出'
                    });
                });
            },
            async getMenuList() {
                const {
                    data: res
                } = await this.$http.get('menus');
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.menulist = res.data;
            },
            //点击按钮，菜单折叠与展开
            toggleCollapse() {
                if (!this.isCollapse) {
                    this.isCollapse = true
                } else {
                    this.isCollapse = false
                }
            },
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }
    
    .el-header,
    .el-footer {
        background-color: rgb(252,222,233);
        color: #333;
        text-align: center;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        padding: 0;
        align-items: center;
        font-size: 20px;
        div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }
    
    .el-aside {
        background-color: rgb(255, 245, 245);
        color: #333;
        // text-align: center;
        line-height: 200px;
        .el-menu {
            border-right: none;
        }
    }
    
    .el-main {
        background-color: rgb(255,255,255);
        color: #333;
        /* text-align: center; */
        /* line-height: 160px; */
    }
    
    body>.el-container {
        margin-bottom: 40px;
    }
    
    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }
    
    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
    
    .iconfont {
        margin-right: 10px;
    }
    
    .toggle-button {
        background-color: rgb(254,251,253);
        font-size: 10px;
        line-height: 28px;
        color: rgb(46,38,56);
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>