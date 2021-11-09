<template>
    <div class="Bigbox">

        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>

            <!-- 搜索与添加区 -->
            <el-row :gutter="20">

                <!-- 搜索 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                </el-col>

                <!-- 添加 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>

            </el-row>

            <!-- 添加用户的表单弹窗区 -->
            <el-dialog title="添加新用户" :visible.sync="addDialogVisible" @close="addDialogClosed">
                <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef">
                    <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                        <el-input v-model="addForm.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                        <el-input v-model="addForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                        <el-input v-model="addForm.email" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
                        <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="用户角色" prop="username" :label-width="formLabelWidth">
                        <el-select v-model="addForm.region" placeholder="请选择角色">
                            <el-option label="超级管理员" value="shanghai"></el-option>
                            <el-option label="主管" value="beijing"></el-option>
                        </el-select>
                    </el-form-item> -->

                </el-form>
                <!-- 底部按钮区 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser()">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 修改用户的表单弹窗区 -->
            <el-dialog title="修改用户信息" :visible.sync="editDialogVisible">
                <el-form :model="editForm" status-icon :rules="editFormRules" ref="editFormRef">
                    <el-form-item label="用户名称" :label-width="formLabelWidth">
                        <el-input v-model="editForm.username" disabled autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                        <el-input v-model="editForm.email" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
                        <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="用户角色" prop="username" :label-width="formLabelWidth">
                        <el-select v-model="addForm.region" placeholder="请选择角色">
                            <el-option label="超级管理员" value="shanghai"></el-option>
                            <el-option label="主管" value="beijing"></el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>

                <!-- 底部按钮区 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUser()">确 定</el-button>
                </div>
            </el-dialog>

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
                            <el-button icon="el-icon-delete" size="mini" type="danger" @click="">
                            </el-button>
                        </el-tooltip>

                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="角色更改" placement="top-start" :enterable="false">
                            <el-button icon="el-icon-s-custom" size="mini" type="primary"
                                @click="handleDelete(scope.row)">
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
                //用户表格页码的参数对象
                queryInfo: {
                    // 列表数据
                    query: '',
                    // 当前的页数
                    pagenum: 1,
                    //当前每页显示多少条数据
                    pagesize: 10
                },
                userlist: [],
                total: 4,

                //控制添加用户对话框的显示与隐藏
                addDialogVisible: false,
                editDialogVisible: false,

                // 添加用户的表单数据
                addForm: {
                    username: 'Misaka',
                    password: '',
                    email: '',
                    mobile: ''
                },
                editForm: {},

                // 添加用户表单的宽度
                formLabelWidth: '120px',

                // 表单验证
                addFormRules: {
                    username: [{
                        required: true,
                        message: '请输入用户名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 8,
                        max: 12,
                        message: '长度在 8 到 12 个字符',
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
                editFormRules: {
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
                }
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            // 加载列表
            async getUserList() {
                //减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                //使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                const {
                    data: res
                } = await this.$http.get('users', {
                        params: this.queryInfo
                    })
                    // console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.userlist = res.data.users;
                // console.log(this.userlist);
                this.total = res.data.total;
                // console.log(this.total);
            },
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
            // 监听 switch 开关状态
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
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加新用户
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    // console.log(valid)
                    if (!valid) return

                    // 发起添加用户的网络请求
                    // 减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                    // 使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                    // 以 对象 的形式传送数据
                    const {
                        data: res
                    } = await this.$http.post('users', this.addForm)
                        // console.log(res);
                    if (res.meta.status !== 201) return this.$message.error('添加用户失败！');
                    this.$message.success('添加用户成功！');
                    // 关闭添加用户的对话框
                    this.addDialogVisible = false;
                    // 重新获取用户列表数据
                    this.getUserList();
                })
            },
            // 展示修改用户信息对话框
            async showEditDialog(id) {
                // console.log(id);
                this.editDialogVisible = true;
                const {
                    data: res
                } = await this.$http.get(`users/${id}`)
                    // console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败');
                }
                this.$message.success('查询成功')
                this.editForm = res.data;
                console.log(this.editForm);
            },
            // 点击按钮修改用户信息
            editUser() {
                this.$refs.editFormRef.validate(async valid => {
                    console.log(valid)
                    if (!valid) return
                        // 发起添加用户的网络请求
                        // 减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                        // 使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                        // 以 对象 的形式传送数据
                    const {
                        data: res
                    } = await this.$http.put(`users/${this.editForm.id}`, {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
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
            }
        }
    }
</script>
<style lang="less" scoped>

</style>