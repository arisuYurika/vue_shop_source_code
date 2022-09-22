<template>
    <div class="Bigbox">

        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="RightsList" border stripe style="width: 100%">
                <!-- 序号栏 -->
                <el-table-column type="index" label="序号" width="70" align="center">
                </el-table-column>

                <!-- 权限说明栏 -->
                <el-table-column prop="authName" label="权限说明" width="180">
                </el-table-column>

                <!-- 权限路径栏 -->
                <el-table-column prop="path" label="路径">
                </el-table-column>

                <!-- 权限等级栏 -->
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag v-if="scope.row.level === '1'" type="success">二级权限</el-tag>
                        <el-tag v-if="scope.row.level === '2'" type="danger">三级权限</el-tag>
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
                // 权限列表空数组
                RightsList: []
            }
        },
        created() {
            // 获取所有的权限列表数据
            this.getRightsList();
        },
        methods: {
            // 获取权限列表
            async getRightsList() {
                const {
                    data: res
                } = await this.$http.get(`rights/list`)
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.RightsList = res.data;
            }
        }
    }
</script>
<style lang="less" scoped>

</style>