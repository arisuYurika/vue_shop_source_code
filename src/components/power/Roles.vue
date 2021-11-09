<template>
    <div class="Bigbox">
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 添加角色浮窗区 -->
        <el-dialog
        title="添加新角色"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="addDialogClosed"
        >
            <el-form ref="form" :model="newRoleForm" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="newRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="newRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createNewRole()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 卡片视图 -->
        <el-card>

            <!-- 添加角色按钮区 -->
            <el-row>
                <el-col>
                    <el-button type="primary" plain @click="dialogVisible = true;">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区 -->
            <el-table :data="RoleList" border stripe style="width: 100%">
                <!-- 展开列 -->
                <el-table-column type="expand" width="70">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'']" 
                        v-for="(item1 ,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2) in item1.children" :key="item2.id">
                                    <el-col>
                                        <el-tag type="success">
                                            {{item2.authName}}
                                        </el-tag>
                                     <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 序号 栏 -->
                <el-table-column type="index" label="序号" width="70" align="center">
                </el-table-column>
                <!-- 角色名称 -->
                <el-table-column prop="roleName" label="角色名称" width="180">
                </el-table-column>
                <!-- 角色类型栏 -->
                <el-table-column prop="children" label="" width="180">
                </el-table-column>
                <!-- 角色类型描述栏 -->
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <!-- 操作栏 -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button size="mini" icon="el-icon-s-tools" type="warning">分配权限</el-button>
                    </template>
</el-table-column>

</el-table>
</el-card>
</div>
</template>
<script>
    export default {
        data() {
            return {
                // 角色列表
                RoleList: [],
                RoleChildren: [],

                // 浮悬窗是否显示
                dialogVisible: false,

                // 新角色用户数据
                newRoleForm: {
                    roleName: '百合花',
                    roleDesc: '拥有一切权限'
                }
            }
        },
        created() {
            this.getRolesList();
        },
        methods: {
            // 获得角色列表
            async getRolesList() {
                const {
                    data: res
                } = await this.$http.get(`roles`);
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg);
                // 将获取到的数据存储进data中
                this.RoleList = res.data;
                this.RoleChildren = res.data.children
            },
            // 监听添加用户区关闭的事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            // 添加新角色
            async createNewRole(){
                const {data:res}=await this.$http.post(`roles`,this.newRoleForm);
                console.log(res);
                if(res.meta.status !== 201)return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.getRolesList();
                this.dialogVisible = false;
            },
            // 删除角色
            async deleteRole(id){
                // console.log(id)
                const confirmResult =await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err);
                if(confirmResult !== 'confirm')return this.$message.error(res.meta.msg);
                const {data: res} =await this.$http.delete(`roles/${id}`)
                console.log(res)
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.getRolesList();
            }
        }
    }
</script>
<style lang="less" scoped>

</style>