<script setup>
    import {statisticalService} from '@/api/statistical/statistical.js'
    import {ref, onMounted, watch} from "vue";
    import {ElMessage} from 'element-plus';
    import * as echarts from 'echarts';
    const userCount = ref(0)
    const articleCount = ref(0)
    const userGrowth = ref([])
    const form = ref([])
    const lineChartRef = ref(null);
    let lineChart = ref(null)
    const props = defineProps({
        receivedMessage:{
            type:Object,
            default:null,
        }
    })
    let unsubscribe = ()=>{}
    onMounted(()=>{
        unsubscribe = watch(
            ()=> props.receivedMessage,
            (newMessage)=>{
                if (newMessage){
                    const data = newMessage
                    if (data.type == 'RealTimeStatistics'){
                        const da = data.data
                        if (da.userCount){
                            userCount.value = da.userCount
                            userGrowth.value = da.userGrowth
                            lineChart.dispose()
                            renderLineChart()
                        }
                        if (da.articleCount){
                            articleCount.value = da.articleCount
                        }
                        form.value = [
                            {background:'deepskyblue',title:'用户统计',count:userCount.value,countTitle:'当前用户数量'},
                            {background:'orange',title:'文章统计',count:articleCount.value,countTitle:'当前文章数量'}
                        ]
                    }
                }
            },
            {immediate: true}
        )
    })

    const renderLineChart = () => {
        lineChart = echarts.init(lineChartRef.value);
        const xAxisData = userGrowth.value.map(item => item.createTime);
        const yAxisData = userGrowth.value.map(item => item.userCount);

        const option = {
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yAxisData,
                type: 'line'
            }]
        };

        lineChart.setOption(option);
    };
    const statistical = async () => {
        const result = await statisticalService()
        userCount.value = result.data.userCount
        articleCount.value = result.data.articleCount
        userGrowth.value = result.data.userGrowth
        // ElMessage.success(result.msg)
        form.value = [
            {background:'deepskyblue',title:'用户统计',count:userCount.value,countTitle:'当前用户数量'},
            {background:'orange',title:'文章统计',count:articleCount.value,countTitle:'当前文章数量'}
        ]
        renderLineChart()
    }
    statistical()
</script>


<template>
    <el-card style="height: 99%;">
        <template #header>
            <div>
                <h4>统计分析</h4>
            </div>
        </template>
        <div class="header-item">
            <el-card v-for="(card,index) in form" :style="{width: '400px',backgroundColor: card.background,color: 'white'}" class="custom-card">
                <div class="item-one">
                    <span>{{ card.title }}</span>
                    <el-button type="success" plain>实时</el-button>
                </div>
                <div class="item-two">
                    <span>{{ card.count }}</span>
                </div>
                <div class="item-three">
                    <span>{{ card.countTitle }}</span>
                </div>
            </el-card>
        </div>
        <div class="line-chart-container" :style="{ width: '100%',height: '400px' }">
            <span>用户增长折线图</span>
            <div ref="lineChartRef" class="echarts-chart"></div>
        </div>
    </el-card>
</template>


<style scoped>
    .header-item{
        display: flex;
        justify-content: center;
    }
    .custom-card:not(:first-child) {
        margin-left: 100px; /* 调整卡片之间的水平间距，但不影响第一个卡片 */
    }
    .item-one{
        display: flex;
        justify-content: space-between;
    }
    .item-two{
        text-align: center;
        font-size: 25px;
        margin: 10px 0;
    }
    .el-button:hover {
        background-color: white !important; /* 使用 !important 来覆盖原始样式 */
        color: #67c23a !important;
        border-color: #67c23a !important;
    }
    .line-chart-container {
        position: relative;
        text-align: center;
        margin-top: 20px;
    }
    .line-chart-container span{
        font-size: 20px;
        font-weight: bold;
    }
    .echarts-chart {
        width: 100%;
        height: 100%;
    }
</style>