<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 添加新分类浮窗区 -->
        <el-dialog
        title="添加新分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="addCateDialogClosed">
            <!-- 添加商品分类的表单 -->
            <el-form
            label-width="80px" 
            ref="addCateFormRef"
            :rules="addCateFormRules"
            :model="addCateForm">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级分类">
                    <div class="block">
                        <!-- options 指定数据源 -->
                        <!-- props 指定配置对象 -->
                        <el-cascader
                        clearable
                        expand-trigger="hover"
                        :options="parentCateList"
                        :props="cascaderProps"
                        v-model="selectedKeys"
                        @change="parentCateChanged"
                        style="width:100%;"
                        change-on-select>
                        </el-cascader>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类浮窗区 -->
        <el-dialog
        title="修改分类"
        :visible.sync="editCateDialogVisible">
            <el-form label-width="80px" ref="newCateFormRef">
                <el-form-item label="分类名称">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 卡片视图 -->
        <el-card>

            <!-- 添加商品分类按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" plain @click="showAddCateDialog">添加新分类</el-button>
                </el-col>
            </el-row>

            <!-- 商品分类列表展示区 -->
            <tree-table 
            index-text="序号"
            :data="CateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            border
            :show-row-hover="false"
            class="treeTable">
                <!-- 是否有效栏 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                    <i class="el-icon-error"   v-if="scope.row.cat_deleted === true" style="color:red ;"></i>
                </template>

                <!-- 排序栏 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                    <el-tag size="mini" v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
                </template>

                <!-- 操作栏 -->
                <template slot="option" slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页栏 -->
            <el-pagination 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" 
            :page-sizes="[1, 2, 3, 5, 10]" 
            :page-size=queryInfo.pagesize 
            layout="total, sizes, prev, pager, next, jumper" 
            :total=total>
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 商品分类列表数据
            CateList:[],

            // 悬浮窗开关状态
            addCateDialogVisible:false,
            editCateDialogVisible:false,

            //用户表格页码参数对象
            queryInfo: {
                // 获取1、2、3层分类列表
                type:3,
                // 当前页码 默认显示第一页
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 10
            },
            // 总数据条数
            total: 0,
            //列表纵行定义
            columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '200px',
          },
          {
            label: '是否有效',
            minWidth: '200px',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'isok'
          },
          {
            label: '排序',
            width: '200px',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'order'
          },
          {
            label: '操作',
            width: '300px',
            // 表示将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'option'
            }],
            // 增加商品分类的表单数据对象（单个）
            addCateForm: {
                // 将要添加的新分类名称
                cat_name:'',
                // 父级分类的id
                cat_pid:'',
                // 默认添加一级分类
                cat_level:''
            },
            // 新商品分类名称规则
            addCateFormRules:{
                cat_name:[{
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    },{
                        min: 1,
                        max: 12,
                        message: '长度在 1 到 12 个字之间',
                        trigger: 'blur'
                    }
                ]
            },
            // 父级分类列表
            parentCateList:[],
            // 指定级联选择器的配置对象
            cascaderProps:{ 
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 选中的父级分类的id数组
            selectedKeys:[]
        }
    },
    mounted(){
        this.getCateList();
    },
    methods:{
        // 获取商品分类列表数据
        async getCateList() {
                //使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                //减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                const {
                    data: res
                } = await this.$http.get('categories',{params:this.queryInfo})
                
                // 如果返回结果为200以外时则return错误提示
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                // 将获取到的数据列表存储进 CateList 中
                this.CateList = res.data.result;
                console.log(res.data);
                // 为总数据条数赋值
                this.total = res.data.total;
        },
        // 删除商品分类
        async deleteCate(id){
            // console.log(id)
            // 弹窗确认是否删除 获取结果为 confirm 或 cancel
            const confirmResult =await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            // 获取结果为 confirm 或 cancel
            if(confirmResult !== 'confirm')return
            // 结果为 confirm时进行接口请求
            const {data: res} =await this.$http.delete(`categories/${id}`)
            // console.log(res)
            // 当返回结果为200以外时为失败
            if(res.meta.status !== 200)return this.$message.error(res.meta.msg);
            // 弹出成功显示
            this.$message.success(res.meta.msg);
            // 重新获取用户列表数据
            this.getCateList();
        },
        // 页码大小变化事件
        handleSizeChange(newSize) {
            console.log(`每页 ${newSize} 条`); 
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 页码变化事件
        handleCurrentChange(newPage) {
            console.log(`当前页: ${newPage}`);
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        // 展示添加分类悬浮框
        showAddCateDialog(){
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        // 新增分类选择选项发生变化时触发这个函数
        parentCateChanged() {
            console.log(this.selectedKeys);
            if(this.selectedKeys.length > 0){
                this.addCateForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const{data:res}= await this.$http.get('categories',{parent:{
                type:2
            }})
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            console.log(res.data);
            this.parentCateList = res.data;
        },
        // 点击确定按钮，添加新的分类
        addCate(){
            console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(async valid =>{
                if(!valid){return}
                const {data:res}= await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201)return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        //监听悬浮框的关闭事件，重置表单数据
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
el-cascader{
    width:100%;
}
</style>