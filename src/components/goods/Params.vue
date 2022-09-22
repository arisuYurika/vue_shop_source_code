<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！"
            type="warning" :closable="false"
            show-icon>
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的连级选择框 -->
                        <!-- options 指定数据源 -->
                        <!-- props 指定配置对象 -->
                        <el-cascader
                        clearable
                        expand-trigger="hover"
                        :options="CateList"
                        :props="cateProps"
                        v-model="selectedKeys"
                        @change="parentCateChanged"
                        change-on-select>
                        </el-cascader>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 商品分类列表数据
            CateList:[],
            // 级联选择框的配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            }
        }
    },
    mounted(){
        getCateList()
    },
    methods:{
        // 获取商品分类列表数据
        async getCateList() {
                //使用 { data:res } 从数据对象身上解构出 data 属性，并重命名为 res
                //减少数据复杂程度而使用 async 与 await ，使用后则需要用const接收数据对象
                const {
                    data: res
                } = await this.$http.get('categories')
                
                // 如果返回结果为200以外时则return错误提示
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                // 将获取到的数据列表存储进 CateList 中
                this.CateList = res.data.result;
                // console.log(res.data);
        },
    }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
</style>