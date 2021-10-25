<template>
    <div class="home-container">
        <el-container class="home-container">
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <img src="../assets/heima.png" alt="vue">
                    <span>后台管理系统</span>
                </div>
                <el-button type="danger" @click="logout">退出登录</el-button>
            </el-header>
            <el-container>
                <!-- 侧边栏区域 -->
                <el-aside width="200px">Aside</el-aside>
                <el-container>
                <!-- 内容主体区 -->
                <el-main>
                    
                </el-main>
                <!-- 脚 -->
                <el-footer>Footer</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
    methods: {
        logout(){
            // 清空session
            window.sessionStorage.clear();
            // 重定向
            this.$router.push("/login");
        }
    }
}
</script>
<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    // text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    color:#fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    // text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    // text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>