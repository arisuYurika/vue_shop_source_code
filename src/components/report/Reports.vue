<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div ref="charts" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
    data(){
        return{
            option:{
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },
    mounted(){
        this.getReports();
    },
    methods:{
        async getReports(){
            let myChart = echarts.init(this.$refs.charts);
            const {data:res} = await this.$http.get('reports/type/1')
            // console.log(res);
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg);
            }else{
                // 绘制图表
                const result = _.merge(res.data,this.option)
                myChart.setOption(result);
                this.$message.success(res.meta.msg)
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>