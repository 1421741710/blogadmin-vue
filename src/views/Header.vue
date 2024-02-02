<script setup>
    import {CaretBottom, UserFilled} from '@element-plus/icons-vue'
    import {ElMessage} from 'element-plus'
    import {useStore} from '@/stores/store.js'
    import {ref} from "vue";
    import {updateAdminPwdService} from '@/api/admin/admin.js';
    import router from '@/router'
    const store = useStore()
    const quit = () => {
        store.removeStore()
        ElMessage.success('退出成功')
        router.push('/login')
    }
    const checkRePassword = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次确认密码'))
        } else if (value !== form.value.password) {
            callback(new Error('请确保两次输入的密码一致'))
        } else {
            callback()
        }
    }
    const roles = {
        username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 5, max: 20, message: '长度为5~20位非空字符', trigger: 'blur'}
        ],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, max: 20, message: '长度为5~20位非空字符', trigger: 'blur'}
        ],
        newPassword: [
            {required: true, validator: checkRePassword, trigger: 'blur'}
        ]
    }
    const formRef = ref(null)
    const dialogVisible = ref(false)
    const form = ref({
        username: null,
        password: null,
        newPassword: null
    })
    const updatePwd = async () => {
        const json = JSON.stringify(form.value)
        const result = await updateAdminPwdService(json)
        ElMessage.success(result.msg)
        dialogVisible.value = false
        store.removeStore()
        router.push('/login')
        ElMessage.success('重新登录')
    }
    const handleClose = (done) => {
        formRef.value.resetFields()
        form.value = {}
        done()
    }
</script>
<template>
    <div class="header">
        <div class="content-two">
            <el-dropdown>
                <div class="two-item">
                    <el-avatar src="https://music-1306786696.cos.ap-guangzhou.myqcloud.com/avatar20.png"></el-avatar>
                    <el-icon class="el-icon--right">
                        <CaretBottom/>
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <div style="margin: 10px 0;text-align: center;">
                            <span>{{ store.admin.username }}</span>
                        </div>
                        <el-dropdown-item @click="dialogVisible = true">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="quit">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-dialog v-model="dialogVisible" title="修改密码" width="20%" :before-close="handleClose">
            <el-form ref="formRef" :model="form" :rules="roles" label-position="top">
                <el-form-item label="账号" prop="username">
                    <el-input style="width: 200px;" type="username" v-model="form.username" placeholder="请输入账号"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input style="width: 200px;" type="password" v-model="form.password" show-password
                              placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input style="width: 200px;" type="password" v-model="form.newPassword" show-password
                              placeholder="请输入新密码"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="updatePwd">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style scoped>
    .header {
        background-color: white;
        height: 60px;
        display: flex;
        justify-content: right;
        align-items: center;
    }

    .two-item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 30px;
    }

    .two-item img {
        width: 35px;
        height: 35px;
    }

    :deep(:focus-visible) {
        outline: none;
    }
</style>