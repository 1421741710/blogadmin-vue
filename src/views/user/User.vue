<script setup>
    import {userPageQueryService,updateStatusService,userUpdateService} from '@/api/user/user.js'
    import { User, Lock,InfoFilled,Message } from '@element-plus/icons-vue'
    import {ref,onMounted} from "vue";
    import {ElMessage} from 'element-plus';
    const admins = ref([])
    const username = ref('')
    const mailbox = ref('')
    const status = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const message = ref('')
    const formRef = ref(null)

    const handleSizeChange = (number) => {
        pageSize.value = number
        userRequest()
    }
    const handleCurrentChange = (number) => {
        currentPage.value = number
        userRequest()
    }

    const userRequest = async ()=>{
        const data = {
            page:currentPage.value,
            pageSize:pageSize.value,
            username:username.value,
            mailbox:mailbox.value,
            status:status.value
        }
        const result = await userPageQueryService(data)
        admins.value = result.data.records
        total.value = result.data.total
    }
    onMounted(()=>{
        userRequest()
    })
    const form = ref({id:null,username:null,password:null,newPassword:null})
    const drawer = ref(false)
    const checkRePassword = (rule,value,callback)=>{
        if (value === ''){
            callback(new Error('请再次确认密码'))
        }else if (value !== form.value.password){
            callback(new Error('请确保两次输入的密码一致'))
        }else{
            callback()
        }
    }
    const roles = {
        password:[
            {required: true,message: '请输入密码',trigger: 'blur'},
            {min: 5,max: 20,message: '长度为5~20位非空字符',trigger: 'blur'}
        ],
        newPassword:[
            {required: true,validator: checkRePassword,trigger: 'blur'}
        ]
    }

    const reset = ()=>{
        username.value = null
        mailbox.value = null
        status.value = null
        userRequest()
    }

    const updateStatus = async (id) =>{
        const result = await updateStatusService(id)
        ElMessage.success(result.msg)
        userRequest()
    }

    const updatePwd = (data) => {
        drawer.value = true
        form.value.id = data.id
        form.value.username = data.username
    }

    const beforeCloseHandler = (done) => {
        form.value = {}
        formRef.value.resetFields()
        done()
    }

    const choose = async () => {
        const data = {
            id:form.value.id,
            password:form.value.password,
            mailbox:''
        }
        const json = JSON.stringify(data)
        const result = await userUpdateService(json)
        ElMessage.success(result.msg)
        formRef.value.resetFields()
        userRequest()
    }

</script>

<template>
    <el-card>
        <template #header>
            <div class="header">
                <span>用户管理</span>
            </div>
        </template>
        <div class="mian">
            <span>用户名</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="User" placeholder="请输入用户名" v-model="username" clearable></el-input>
            <span>邮箱</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="Message" placeholder="请输入邮箱" v-model="mailbox" clearable></el-input>
            <span>状态</span>
            <el-select style="width: 200px;margin: 0 20px 0 10px;" v-model="status" slot="prepend" placeholder="请选择状态">
                <el-option label="禁用" value="1"></el-option>
                <el-option label="可用" value="2"></el-option>
            </el-select>
            <el-button type="primary" @click="userRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="admins" border style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="账号" prop="username" width="150"></el-table-column>
            <el-table-column label="密码" prop="password" show-overflow-tooltip></el-table-column>
            <el-table-column label="邮箱" prop="mailbox" show-overflow-tooltip></el-table-column>
            <el-table-column label="权限" prop="role" width="100">
                <template v-slot="{row}">
                    <span v-if="row.role == 0">无</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100">
                <template v-slot="{row}">
                    <span v-if="row.status == 1">锁定</span>
                    <span v-else>可用</span>
                </template>
            </el-table-column>
            <el-table-column label="最近登录时间" prop="loginTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300">
                <template v-slot="{row}">
                    <el-popconfirm
                            cancel-button-text="取消"
                            confirm-button-text="确定"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                            :title="row.status == 1 ? '你确定启用吗?' : '你确定禁用吗?'"
                            @confirm="updateStatus(row.id)">
                        <template #reference>
                            <el-button v-if="row.status == 1" type="warning" plain>启用</el-button>
                            <el-button v-else type="warning" plain>禁用</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="info" @click="updatePwd(row)" plain>编辑</el-button>
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
        </div>
        <el-drawer v-model="drawer" :before-close="beforeCloseHandler" direction="rtl">
            <template #header>
                <h4>修改用户密码</h4>
            </template>
            <el-form
                    ref="formRef"
                    label-position="right"
                    label-width="150px"
                    :model="form"
                    style="max-width: 500px"
                    :rules="roles"
            >
                <el-form-item label="账号">
                    <el-input v-model="form.username" style="width: 200px;" :prefix-icon="User" placeholder="请输入账号" disabled />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" style="width: 200px;" :prefix-icon="Lock" show-password v-model="form.password" placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item label="再次输入密码" prop="newPassword">
                    <el-input type="password" style="width: 200px;" :prefix-icon="Lock" show-password v-model="form.newPassword" placeholder="请再次输入密码"/>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 200px;" type="primary" @click="choose">提交</el-button>
                </el-form-item>
            </el-form>
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