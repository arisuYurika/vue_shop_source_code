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
        :visible.sync="addRoleDialogVisible"
        @close="addRoleDialogClosed">
            <el-form :model="newRoleForm" label-width="80px" ref="newRoleFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="newRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="newRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createNewRole()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 权限分配浮窗区 -->
        <el-dialog
        title="权限分配"
        :visible.sync="setRightDialogVisible"
        @close="setRightDialogClosed">
            <!-- 树形展示权限控件 -->
            <el-tree
            :data="RightListTree"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="treeRef"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="defkeys"
            >
            </el-tree>
            <span slot="footer">
                
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRight()">确 定</el-button>
                
            </span>
        </el-dialog>

        <!-- 卡片视图 -->
        <el-card>

            <!-- 添加角色按钮区 -->
            <el-row>
                <el-col>
                    <el-button type="primary" plain @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区 -->
            <el-table :data="RoleList" border stripe style="width: 100%">

                <!-- 展开列 -->
                <el-table-column type="expand" width="70">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'' ,'vcenter']" 
                        v-for="(item1 ,i1) in scope.row.children" :key="item1.id">

                            <!-- 渲染一级权限 -->
                            <el-col :span="3">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="21">
                                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">

                                    <!-- 二级权限 -->
                                    <el-col :span="4">
                                        <el-tag type="success">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <!-- 三级权限 -->
                                    <el-col :span="20">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">
                                            {{item3.authName}}
                                        </el-tag>
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
                        <el-button size="mini" icon="el-icon-s-tools" type="warning" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
</el-table-column>

            </el-table>

        </el-card>

    </div>
</template>

<script>
    export default {

        // 数据区
        data() {
            return {
                // 角色列表
                RoleList: [],

                // 悬浮窗显示控制开关
                // 增加用户
                addRoleDialogVisible: false,
                setRightDialogVisible:false,
                // 新角色用户数据
                newRoleForm: {
                    roleName: '',
                    roleDesc: ''
                },

                // 权限展示树
                RightListTree:[],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },

                //默认选中的节点的id值数组
                defkeys:[],

                // 当前即将分配权限的角色id
                roleId:''
            }
        },

        // 生命周期创造区
        created() {
            this.getRolesList();
        },

        // 方法methods区
        methods: {
            // 获取角色列表
            async getRolesList() {
                const {
                    data: res
                } = await this.$http.get(`roles`);
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg);
                // 将获取到的数据存储进data中
                // 角色数据
                this.RoleList = res.data;
            },

            // 监听 添加新角色悬浮窗关闭时 的事件
            addRoleDialogClosed() {
                // console.log('Misaka')
                // 当悬浮窗关闭时，清空表单
                this.$refs.newRoleFormRef.resetFields();
            },

            // 添加新角色
            async createNewRole(){
                // 1.发起添加用户的网络接口请求
                // 2.为减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                // 3.使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                // 4.以 对象 的形式传送数据
                const {data:res}=await this.$http.post(`roles`,this.newRoleForm);
                // console.log(res);
                // 返回结果为201之外时则返回错误提示
                if(res.meta.status !== 201)return this.$message.error(res.meta.msg);
                // 成功增添提示
                this.$message.success(res.meta.msg);
                // 重新获取用户列表数据
                this.getRolesList();
                // 关闭添加用户的对话框
                this.addRoleDialogVisible = false;
            },

            // 删除角色
            async deleteRole(id){
                // console.log(id)
                // 弹窗确认是否删除 获取结果为 confirm 或 cancel
                const confirmResult =await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err);
                // 获取结果为 confirm 或 cancel
                if(confirmResult !== 'confirm')return
                // 结果为 confirm时进行接口请求
                const {data: res} =await this.$http.delete(`roles/${id}`)
                // console.log(res)
                // 当返回结果为200以外时为失败
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg);
                // 弹出成功显示
                this.$message.success(res.meta.msg);
                // 重新获取用户列表数据
                this.getRolesList();
            },

            // 展示分配角色权限情况的悬浮框
            async showSetRightDialog(role){
                // console.log(role)
                // 打开悬浮框
                
                this.roleId = role.id;
                // 获得所有权限的数据
                const {data: res} =await this.$http.get(`rights/tree`)
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg)
                this.RightListTree = res.data;
                // 调用下面的递归方法并传参
                this.getLeafKeys(role,this.defkeys)
                // console.log(this.RightListTree)
                this.setRightDialogVisible = true;
            },
            // 通过递归形式，获取该选中角色下所有三级权限的id，并展示到悬浮窗
            getLeafKeys(node,arr){
                // 如果当前node节点不包含children属性，则是三级节点
                if(!node.children)return arr.push(node.id)
                node.children.forEach(item => this.getLeafKeys(item,arr))
            },

            //监听分配权限悬浮框的关闭事件
            setRightDialogClosed(){
                // 关闭后清空选中权限
                this.defkeys = [];
            },

            // 在分配权限悬浮窗中按下确定后，将数据传输给接口进行权限分配
            async setRight(){
                // console.log('Misaka')
                const keys = [
                    ...this.$refs.treeRef.
                    getCheckedKeys(),
                    ...this.$refs.treeRef.
                    getHalfCheckedKeys()]
                const idStr = keys.join(',');
                
                const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.getRolesList();
                // 关闭权限分配窗口
                this.setRightDialogVisible = false;
            }
        }
    }
</script>

<style lang="less" scoped>
.el-tag {
    margin: 11px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.miniBox {
    margin: 10px;
}

.vcenter{
    display: flex;
    align-items: center;
}
</style>