<script setup>
    import {processService,updateStatusService,processUpdateService} from '@/api/process/process.js'
    import { InfoFilled,Message,User,List,Memo,Edit,Filter } from '@element-plus/icons-vue'
    import {ref,onMounted,onBeforeUnmount} from "vue";
    import {ElMessage} from 'element-plus';
    import {useStore} from '@/stores/store.js'
    const process = ref([])
    const type = ref(null)
    const status = ref(null)
    const result = ref(null)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const formRef = ref(null)
    const store = useStore()
    const AdminName = ref(null)

    const handleSizeChange = async (number) => {
        pageSize.value = number
        await processRequest()
    }
    const handleCurrentChange = async (number) => {
        currentPage.value = number
        await processRequest()
    }

    const processRequest = async ()=>{
        const data = {
            page:currentPage.value,
            pageSize:pageSize.value,
            type:type.value,
            status:status.value,
            result:result.value
        }
        const results = await processService(data)
        process.value = results.data.records
        total.value = results.data.total
        AdminName.value = store.admin.username
    }
    const timer = ref(null)
    onMounted(()=>{
        processRequest()
        timer.value = setInterval(()=>{
            processRequest()
        },180000)
    })
    onBeforeUnmount(()=>{
        if (timer.value != null){
            clearInterval(timer.value)
            timer.value = null
        }
    })

    const form = ref({id:null,userName:null,adminName:null,type:null,content:null,status:null,result:null,remark:null})
    const drawer = ref(false)
    const roles = {
        result:[
            {required: true,message: '请选择审核结果',trigger: 'blur'},
        ]
    }

    const reset = async ()=>{
        type.value = null
        status.value = null
        result.value = null
        await processRequest()
    }

    const updateStatus = async (id) =>{
        const result = await updateStatusService(id)
        ElMessage.success(result.msg)
        await processRequest()
    }
    const typeName = ref(null)

    const startProcess = async (data) => {
        if (data.adminName == null || data.adminName == store.admin.username){
            form.value = data
            typeName.value = form.value.type == 1 ? '用户昵称' : '用户头像'
            drawer.value = true
            if (data.status != 3){
                await updateStatus(data.id)
            }
        }else{
            ElMessage.error('已在审核中')
            drawer.value = false
        }
    }

    const beforeCloseHandler = (done) => {
        document.querySelector('.el-drawer__body').scrollTo(0, 0)
        form.value = {}
        formRef.value.resetFields()
        drawer.value = false
        done()
    }

    const choose = async () => {
        drawer.value = false
        const data = {
            id:form.value.id,
            result:form.value.result,
            remark:form.value.remark
        }
        const json = JSON.stringify(data)
        const result = await processUpdateService(json)
        ElMessage.success(result.msg)
        formRef.value.resetFields()
        await processRequest()
    }

    // 图片预览状态
    const isPreviewActive = ref(false);
    // 当前预览的图片URL
    const previewImageUrl = ref(null);

    function handlePreview(imgUrl) {
        isPreviewActive.value = true;
        previewImageUrl.value = imgUrl;
    }

    function handleClose() {
        isPreviewActive.value = false;
        previewImageUrl.value = null;
    }

</script>

<template>
    <el-card>
        <template #header>
            <div class="header">
                <span>审核管理</span>
            </div>
        </template>
        <div class="mian">
            <span>审核类型</span>
            <el-select style="width: 200px;margin: 0 20px 0 10px;" v-model="type" slot="prepend" placeholder="请选择审核类型">
                <el-option label="用户昵称" value="1"></el-option>
                <el-option label="用户头像" value="2"></el-option>
            </el-select>
            <span>审核状态</span>
            <el-select style="width: 200px;margin: 0 20px 0 10px;" v-model="status" slot="prepend" placeholder="请选择审核状态">
                <el-option label="未审核" value="1"></el-option>
                <el-option label="已审核" value="2"></el-option>
                <el-option label="审核中" value="3"></el-option>
            </el-select>
            <span>审核结果</span>
            <el-select style="width: 200px;margin: 0 20px 0 10px;" v-model="result" slot="prepend" placeholder="请选择审核结果">
                <el-option label="未通过" value="1"></el-option>
                <el-option label="通过" value="2"></el-option>
            </el-select>
            <el-button type="primary" @click="processRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="process" border style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="审核单号" prop="id"></el-table-column>
            <el-table-column label="用户" prop="userName" ></el-table-column>
            <el-table-column label="审核人" prop="adminName"></el-table-column>
            <el-table-column label="审核类型" prop="type">
                <template v-slot="{row}">
                    <span v-if="row.type == 1">用户昵称</span>
                    <span v-else-if="row.type == 2">用户头像</span>
                </template>
            </el-table-column>
            <el-table-column label="审核内容" prop="content" width="200">
                <template v-slot="{row}">
                    <span v-if="row.type == 1">{{row.content}}</span>
                    <div v-else-if="row.type == 2" style="width: 30px;height: 30px;">
                        <el-image style="width: 30px; height: 30px"
                                  :src="row.content" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                                  @click="handlePreview(row.content)" :initial-index="4" fit="fill" :hide-on-click-modal="true"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" prop="status">
                <template v-slot="{row}">
                    <span v-if="row.status == 1">未审核</span>
                    <span v-else-if="row.status == 2">已审核</span>
                    <span v-else-if="row.status == 3">审核中</span>
                </template>
            </el-table-column>
            <el-table-column label="审核结果" prop="result">
                <template v-slot="{row}">
                    <span v-if="row.result == 1">未通过</span>
                    <span v-else-if="row.result == 2">通过</span>
                </template>
            </el-table-column>
            <el-table-column label="审核备注" prop="remark" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="150">
                <template v-slot="{row}">
                    <el-button v-if="row.status == 1" type="success" @click="startProcess(row)" plain>审核</el-button>
                    <span v-else-if="row.status == 2">已审核</span>
                    <el-button v-if="row.status == 3 && row.adminName == AdminName" type="success" @click="startProcess(row)" plain>继续审核</el-button>
                    <span v-else-if="row.status == 3 && row.adminName != AdminName">审核中</span>
                </template>
            </el-table-column>
        </el-table>
        <el-image-viewer v-if="isPreviewActive" @close="handleClose" :url-list="[previewImageUrl]" />
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
        </div>
        <el-drawer v-model="drawer" :before-close="beforeCloseHandler" size="600px" direction="rtl">
            <template #header>
                <h4>审核</h4>
            </template>
            <div style="display: flex;justify-content: center">
                <el-form
                        ref="formRef"
                        label-position="top"
                        label-width="100%"
                        :model="form"
                        :rules="roles"
                >
                    <el-form-item label="审核单号">
                        <el-input v-model="form.id" style="width: 400px;" :prefix-icon="List" disabled />
                    </el-form-item>
                    <el-form-item label="审核用户">
                        <el-input style="width: 400px;" :prefix-icon="User" :placeholder="form.userName" disabled/>
                    </el-form-item>
                    <el-form-item label="审核人">
                        <el-input style="width: 400px;" :prefix-icon="User" :placeholder="form.adminName" disabled/>
                    </el-form-item>
                    <el-form-item label="审核类型">
                        <el-input style="width: 400px;" :prefix-icon="Filter" :placeholder="typeName" disabled/>
                    </el-form-item>
                    <el-form-item label="审核内容">
                        <el-input v-if="form.type == 1" style="width: 400px;" :prefix-icon="Memo" :placeholder="form.content" disabled/>
                        <div style="border: 1px solid #cdcdcd;width: 200px;height: 200px;" v-else-if="form.type == 2">
                            <el-image style="width: 100%; height: 100%"
                                      :src="form.content" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                                      @click="handlePreview(form.content)" :initial-index="4" fit="fill" :hide-on-click-modal="true"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="审核结果" prop="result">
                        <el-select style="width: 400px;" v-model="form.result" slot="prepend" placeholder="请选择审核结果">
                            <el-option label="未通过" value="1"></el-option>
                            <el-option label="通过" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核备注">
                        <el-input type="textarea" style="width: 400px;" :prefix-icon="Edit" v-model="form.remark" placeholder="审核备注"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width: 200px;" type="primary" @click="choose">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
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
    .header-add{
        width: 50%;
        display: flex;
        justify-content: right;
    }
    .demo-pagination-block {
        margin-top: 20px;
    }
    .mian{
        margin: 10px 0 20px 0;
    }
</style>