<template>
    <div class="login_container">
        <div class="login_box">

            <!-- 头像区 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" title="avatar">
            </div>

            <!-- 登录表单区 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login_form">

                <!-- 用户名 -->
                <el-form-item prop="username">

                    <!-- 用户名输入框 -->
                    <el-input v-model="loginForm.username" 
                    prefix-icon="iconfont icon-user" 
                    placeholder="请输入用户名称">
                    </el-input>

                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop="password">

                    <!-- 密码输入框 -->
                    <el-input v-model="loginForm.password" 
                    prefix-icon="iconfont icon-3702mima" 
                    placeholder="请输入密码" type="password" >
                    </el-input>
                </el-form-item>

                <!-- 按钮区 -->
                <el-form-item class="btns">

                    <!-- 登录按钮 -->
                    <el-button type="primary" @click="login">登录</el-button>

                    <!-- 重置按钮 -->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //  表单的验证规则对象
        rules:{
            //验证用户名是否合法
            username:[
                {required:true,message:"请输入用户名称",trigger:"blur"},
                {min:1,max:6,message:"长度在1~6之间",trigger:"blur"}
            ],
            //验证密码是否合法
            password:[
                {required:true,message:"请输入密码",trigger:"blur"},
                {min:3,max:12,message:"长度在3~12之间",trigger:"blur"}
            ]
        }
      }
    },
    methods: {
        // 重置登录表单
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        
        // 登录按钮
        login(){
            this.$refs.loginFormRef.validate(async valid=>{

                //没有return，说明结果为true，可以发起接下来的请求（axios）
                if(!valid){console.log(valid)}; // 取反为false
                
                //3.返回的数据中，只有data是我们需要的数据
                //4.所以直接在花括号里解构赋值出一个data属性，将data重命名为res（对象）
                const {data: res} = await this.$http.post('login',this.loginForm);
                //1. 原本返回值为Promise，可以通过await、async、axxxxx来修饰简化这次操作
                //2.await只能用在被async（将方法修饰成异步的函数 ）修饰的方法中
                if(res.meta.status !== 200) return this.$message.error('登录失败');
                this.$message.success('登录成功');

                //登陆成功后的行为
                //(1)将登录成功后的token保存到客户端的sessionStorage中（localStorage用于持久化的本地存储，除非主动删除数据，否则永不过期）
                //  a.项目中除了登录以外的其他API接口，必须在登录后才能访问（携带token访问）
                //  b.token只应在当前网站打开期间生效， 所以将token保存在sessionStorage中
                window.sessionStorage.setItem("token",res.data.token);//token保存到了sessionStorage中
                //(2)通过编程式导航跳转到后台主页，路由地址为 /home
                this.$router.push("/home");
            });
        }
    }
  }
</script>

<style lang="less" scoped>
.login_container {
    background-image:url('../assets/header.png'); 
    background-repeat: repeat-x; 
    background-color: rgb(255, 244, 248);
    height: 100%;
}
.login_box{
    width:550px;
    height: 400px;
    background-color: rgb(255, 255, 255);
    border-radius:25px;
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box{
    height: 130px;
    width:130px;
    border: 1px solid #eee;
    // border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    right: 50%;
    transform: translate(50%,-40%);
    background-color: rgb(255, 255, 255);

        img {
            height: 100%;
            width:100%;
            // border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 70px;
    width:100%;
    padding: 0 30px;
    box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}


</style>