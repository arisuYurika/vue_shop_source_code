<template>
    <div class="Bigbox">

        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 添加用户的悬浮窗口区 -->
        <el-dialog 
        title="添加新用户" 
        :visible.sync="addDialogVisible" 
        @close="addDialogClosed">
            <el-form :model="addUserForm" status-icon :rules="addUserFormRules" ref="addUserFormRef">
                <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <!-- 底部按钮区 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改用户的悬浮窗口区 -->
        <el-dialog 
        title="修改用户信息" :visible.sync="editDialogVisible">
            <el-form :model="editUserForm" status-icon :rules="editUserFormRules" ref="editUserFormRef">
                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.username" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>

            <!-- 底部按钮区 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 绑定用户角色的悬浮窗口区 -->
        <el-dialog 
        title="分配用户角色" 
        :visible.sync="setRoleDialogVisible"
        @close="setRoleDialogClosed">
            <el-descriptions>
                <el-descriptions-item label="用户名">{{userInfo.username}}</el-descriptions-item>
                <el-descriptions-item label="当前角色">{{userInfo.role_name}}</el-descriptions-item>
            </el-descriptions>
            <p>分配新角色</p>

            <el-select v-model="selectedRoleId" placeholder="请选择">
            
                <el-option
                v-for="roleItem in roleList"
                :key="roleItem.id"
                :label="roleItem.roleName"
                :value="roleItem.id">
                </el-option>

            </el-select>
            <!-- 底部按钮区 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 卡片背景区 -->
        <el-card>

            <!-- 搜索与添加用户区 -->
            <el-row :gutter="20">

                <!-- 搜索用户 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                </el-col>

                <!-- 添加用户 -->
                <el-col :span="4">
                    <el-button type="primary" plain @click="addDialogVisible = true">添加用户</el-button>
                </el-col>

            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userlist" style="width: 100%" :border="true" :stripe="true">

                <!-- 序号栏 -->
                <el-table-column type="index" label="序号" width="70" align="center">
                </el-table-column>

                <!-- 用户名栏 -->
                <el-table-column prop="username" label="用户名" width="180">
                </el-table-column>

                <!-- 角色栏 -->
                <el-table-column prop="role_name" label="角色" width="220">
                </el-table-column>

                <!-- 电话号码栏 -->
                <el-table-column prop="mobile" label="电话号码" width="150">
                </el-table-column>

                <!-- 邮箱栏 -->
                <el-table-column prop="email" label="邮箱地址">
                </el-table-column>

                <!-- 状态栏 -->
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
</el-table-column>

<!-- 操作栏 -->
<el-table-column label="操作">
    <template slot-scope="scope">

            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top-end" :enterable="false">
                <el-button icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                </el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button icon="el-icon-delete" size="mini" type="danger"
                    @click="handleDelete(scope.row.id)">
                </el-button>
            </el-tooltip>

            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="角色更改" placement="top-start" :enterable="false">
                <el-button icon="el-icon-s-custom" size="mini" type="primary" 
                @click="setRole(scope.row)">
                </el-button>
            </el-tooltip>
    </template>
</el-table-column>

            </el-table>

            <!-- 分页栏 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5, 10]" :page-size=queryInfo.pagesize layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {

        // 数据区
        data() {
            // 验证邮箱的规则（正则） rule规则 value待校验的值 callback回调函数
            var checkEmail = (rule, value, callback) => {
                // 验证邮箱的正则表达式
                var regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

                // 如果 regEmail.test(value) 的返回值为 true，则校验通过
                if (regEmail.test(value)) {
                    callback()
                } else {
                    callback(new Error('邮箱格式不正确'))
                }
            };

            // 验证手机号的规则（正则）
            var checkMobile = (rule, value, callback) => {
                // 验证手机号的正则表达式
                let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    callback()
                } else {
                    callback(new Error('手机号码格式不正确'))
                }
            };

            return {
                //用户表格页码参数对象
                queryInfo: {
                    // 列表数据
                    query: '',
                    // 当前所在页码
                    pagenum: 1,
                    // 每页显示多少条数据
                    pagesize: 10
                },
                // 用户列表数据
                userlist: [],
                total: 4,

                // 悬浮框的显示与隐藏状态
                // 增加用户
                addDialogVisible: false,
                // 修改用户
                editDialogVisible: false,
                // 分配角色
                setRoleDialogVisible:false,

                // 添加用户的表单数据
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 修改用户的表单数据
                editUserForm: {},

                // 添加用户表单的宽度
                formLabelWidth: '120px',

                // 表单添加验证区
                addUserFormRules: {
                    username: [{
                        required: true,
                        message: '请输入用户名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 13,
                        message: '长度在 3 到 13 个字符',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 12,
                        message: '长度在 3 到 12 个字符',
                        trigger: 'blur'
                    }],
                    email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }, {
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入电话号码',
                        trigger: 'blur'
                    }, {
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                // 表单修改验证区
                editUserFormRules: {
                    email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }, {
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入电话号码',
                        trigger: 'blur'
                    }, {
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                // 需要被分配角色的用户信息
                userInfo:{},
                // 角色列表
                roleList:[],
                // 已选中的角色Id值
                selectedRoleId:''
            }
        },

        // 生命周期创造区
        created() {
            this.getUserList();
        },

        // 方法methods区
        methods: {

            // 获取用户列表
            async getUserList() {
                //使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                //减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                const {
                    data: res
                } = await this.$http.get('users', {params: this.queryInfo})
                // console.log(res);
                // 如果返回结果为200以外时则return错误提示
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                // 将获取到的数据存储进data中
                // 用户列表数据
                this.userlist = res.data.users;
                // 分页数据
                this.total = res.data.total;
            },

            //分页相关函数
            // 监听 pagesize 改变的事件
            handleSizeChange(newSize) {
                // console.log(newSize)
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            // 监听页码发生变化的事件
            handleCurrentChange(newPage) {
                // console.log(newPage)
                this.queryInfo.pagenum = newPage;
                this.getUserList();
            },

            // 监听更新用户状态的 switch 开关情况
            async userStateChanged(userInfo) {
                // console.log(userInfo)
                //同样简化返回的对象，解构data重命名res
                const {
                    data: res
                } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('用户状态更新失败');
                    userInfo.mg_state = !userInfo.mg_state;
                }
                this.$message.success('更新成功')
            },

            // 监听添加用户区关闭的事件
            addDialogClosed() {
                this.$refs.addUserFormRef.resetFields()
            },

            // 添加新用户
            addUser() {
                this.$refs.addUserFormRef.validate(async valid => {

                    // valid  该数值用于接收表单预校验是否通过的结果 是个布尔值
                    console.log(valid)
                    if (!valid) return

                    // 1.发起添加用户的网络接口请求
                    // 2.为减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                    // 3.使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                    // 4.以 对象 的形式传送数据
                    const {
                        data: res
                    } = await this.$http.post('users', this.addUserForm)
                    // console.log(res);
                    // 返回结果为201之外时则返回错误提示
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    // 成功添加提示
                    this.$message.success(res.meta.msg);
                    // 关闭添加用户的对话框
                    this.addDialogVisible = false;
                    // 重新获取用户列表数据
                    this.getUserList();
                })
            },

            // 展示修改用户信息的悬浮对话框
            async showEditDialog(id) {
                // console.log(id);
                const {
                    data: res
                } = await this.$http.get(`users/${id}`)
                    // console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败');
                }
                this.$message.success('查询成功')
                this.editUserForm = res.data;
                // console.log(this.editUserForm);
                this.editDialogVisible = true;
            },

            // 修改用户信息
            editUser() {
                this.$refs.editUserFormRef.validate(async valid => {
                    console.log(valid)
                    if (!valid) return
                        // 发起添加用户的网络请求
                        // 减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                        // 使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                        // 以 对象 的形式传送数据
                    const {
                        data: res
                    } = await this.$http.put(`users/${this.editUserForm.id}`, {
                            email: this.editUserForm.email,
                            mobile: this.editUserForm.mobile
                        })
                        // console.log(res);
                    if (res.meta.status !== 200) return this.$message.error('更新用户信息失败！');

                    // 关闭更新用户信息的对话框
                    this.editDialogVisible = false;
                    // 重新获取用户列表数据
                    this.getUserList();
                    // 提示修改成功
                    this.$message.success(res.meta.msg);
                })
            },

            // 删除用户信息
            async handleDelete(id) {
                // console.log(id);
                // 弹窗确认是否删除 获取结果为 confirm 或 cancel
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                // 获取结果为 confirm 或 cancel
                console.log(confirmResult);
                if (confirmResult !== 'confirm') return
                // 结果为 confirm时进行接口请求
                const {
                    data: res
                } = await this.$http.delete(`users/${id}`)
                console.log(res);
                // 当返回结果为200以外时为失败
                if (res.meta.status !== 200)return this.$message.error(res.meta.msg);
                // 重新获取用户列表数据
                this.getUserList();
                // 弹出成功显示
                this.$message.success(res.meta.msg);
            },

            // 展示角色分配悬浮窗
            async setRole(userInfo){

                // console.log(userInfo)
                this.userInfo = userInfo;

                // 在展示对话框之前，获取所有的角色列表
                const {data:res} = await this.$http.get('roles')

                if(res.meta.status !== 200)return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)

                this.roleList = res.data;
                // console.log(this.roleList[8].roleName)

                this.setRoleDialogVisible = true;
                
            },

            // 点击按钮，分配角色
            async saveRoleInfo(){
                console.log(this.selectedRoleId)
                // 如果选择框未选择
                if(!this.selectedRoleId)return this.$message.error('请选择要分配的角色')

                // put数据
                const{data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,
                    {rid: this.selectedRoleId})
                console.log(res)
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg)
                this.getUserList();
                this.setRoleDialogVisible = false;
            },
            // 监听分配角色悬浮框的关闭事件
            setRoleDialogClosed(){
                this.selectedRoleId = '';
                this.userInfo = {}
            }
        }
    }
</script>

<style lang="less" scoped>

</style>