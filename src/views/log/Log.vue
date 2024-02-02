<script setup>
    import {logService} from '@/api/log/log.js'
    import { InfoFilled,Grid,Coordinate } from '@element-plus/icons-vue'
    import {ref,onMounted,watch} from "vue";
    import {ElMessage} from 'element-plus';
    const log = ref([])
    const module = ref('')
    const operator = ref('')
    const time = ref([])
    const startTime = ref(null)
    const finishTime = ref(null)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const handleSizeChange = async (number) => {
        pageSize.value = number
        await commentRequest()
    }
    const handleCurrentChange = async (number) => {
        currentPage.value = number
        await commentRequest()
    }
    watch(time, (newVal) => {
        if (Array.isArray(newVal) && newVal.length === 2) {
            const startDate = newVal[0];
            const endDate = newVal[1];
            startTime.value = formatDate(startDate);
            finishTime.value = formatDate(endDate);
        }
    });

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const commentRequest = async ()=>{
        const data = {
            page:currentPage.value,
            pageSize:pageSize.value,
            module:module.value,
            operator:operator.value,
            startTime:startTime.value,
            finishTime:finishTime.value
        }
        const result = await logService(data)
        log.value = result.data.records
        total.value = result.data.total
    }

    onMounted(()=>{
        commentRequest()
    })

    //重置
    const reset = async () => {
        module.value = null
        operator.value = null
        time.value = []
        startTime.value = null
        finishTime.value = null
        await commentRequest()
    }
    const form = ref({
        adminName:null,
        module:null,
        operator:null,
        className:null,
        params:null,
        ip:null,
        executionTime:null,
        createTime:null,
        updateTime:null
    })
    const drawer = ref(false)
    const checkDetails = (data) => {
        form.value.adminName = data.adminName
        form.value.module = data.module
        form.value.operator = data.operator
        form.value.className = data.className
        form.value.params = data.params
        form.value.params = JSON.parse(form.value.params)
        form.value.ip = data.ip
        form.value.executionTime = data.executionTime
        form.value.createTime = data.createTime
        form.value.updateTime = data.updateTime
        drawer.value = true
    }

</script>

<template>
    <el-card>
        <template #header>
            <div class="header">
                <span>系统日志管理</span>
            </div>
        </template>
        <div class="mian">
            <span>系统日志模块</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="Grid" placeholder="请输入模块" v-model="module" clearable></el-input>
            <span>系统日志模块操作</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="Coordinate" placeholder="请输入模块操作" v-model="operator" clearable></el-input>
            <span>日期</span>
            <el-date-picker
                    v-model="time"
                    type="datetimerange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    date-format="YYYY/MM/DD ddd"
                    time-format="A hh:mm:ss"
            />
            <el-button type="primary" @click="commentRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="log" border style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="操作人" prop="adminName"></el-table-column>
            <el-table-column label="模块" prop="module"></el-table-column>
            <el-table-column label="模块操作" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求方法名" prop="className" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求方法参数" prop="params" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求IP地址" prop="ip" show-overflow-tooltip></el-table-column>
            <el-table-column label="消耗时间" prop="executionTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100">
                <template v-slot="{row}">
                    <el-button type="success" @click="checkDetails(row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 15, 20, 30]"
                    :small="small"
                    :disabled="disabled"
                    :background="background"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
            />
            <el-drawer size="500" v-model="drawer" direction="rtl">
                <template #header>
                    <span>查看系统日志详情</span>
                </template>
                <div class="boot">
                    <div>
                        <span>操作人:</span>
                        <p>{{form.adminName}}</p>
                    </div>
                    <div>
                        <span>模块:</span>
                        <p>{{form.module}}</p>
                    </div>
                    <div>
                        <span>模块操作:</span>
                        <p>{{form.operator}}</p>
                    </div>
                    <div>
                        <span>请求方法名:</span>
                        <p>{{form.className}}</p>
                    </div>
                    <div>
                        <span>请求方法参数:</span>
                        <pre copyable>{{form.params}}</pre>
                    </div>
                    <div>
                        <span>请求IP地址:</span>
                        <p>{{form.ip}}</p>
                    </div>
                    <div>
                        <span>消耗时间:</span>
                        <p>{{form.executionTime}}</p>
                    </div>
                    <div>
                        <span>创建时间:</span>
                        <p>{{form.createTime}}</p>
                    </div>
                </div>
            </el-drawer>
        </div>
    </el-card>
</template>


<style scoped>
    .header{
        display: flex;
        justify-content: left;
        align-items: center;
    }
    .header span{
        width: 50%;
    }
    .demo-pagination-block {
        margin-top: 20px;
    }
    .mian{
        margin: 10px 0 20px 0;
    }
    .boot div{
        margin-bottom: 10px;
        /*border: 1px solid red;*/
    }
    .boot span{
        font-size: 20px;
        font-weight: bold;
    }
    .boot p{
        width: 400px;
        word-wrap: break-word;
    }
</style>