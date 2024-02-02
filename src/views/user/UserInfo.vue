<script setup>
    import {userInfoPageQueryService} from '@/api/user/userInfo.js'
    import { User,InfoFilled,MapLocation,Phone } from '@element-plus/icons-vue'
    import {ref,onMounted} from "vue";
    import {ElMessage} from 'element-plus';
    const admins = ref([])
    const name = ref('')
    const phone = ref('')
    const address = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)

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
            name:name.value,
            phone:phone.value,
            address:address.value
        }
        const result = await userInfoPageQueryService(data)
        admins.value = result.data.records
        total.value = result.data.total
    }
    onMounted(()=>{
        userRequest()
    })
    const reset = ()=>{
        name.value = null
        phone.value = null
        address.value = null
        userRequest()
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
                <span>用户信息管理</span>
            </div>
        </template>
        <div class="mian">
            <span>昵称</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="User" placeholder="请输入昵称" v-model="name" clearable></el-input>
            <span>电话</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="Phone" placeholder="请输入电话" v-model="phone" clearable></el-input>
            <span>地址</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="MapLocation" placeholder="请输入地址" v-model="address" clearable></el-input>

            <el-button type="primary" @click="userRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="admins" border style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="账号id" prop="username" width="150"></el-table-column>
            <el-table-column label="昵称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="头像" prop="img" show-overflow-tooltip>
                <template v-slot="{row}">
                    <el-image style="width: 30px; height: 30px"
                              :src="row.img" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                              @click="handlePreview(row.img)" :initial-index="4" fit="fill" :hide-on-click-modal="true"/>
                </template>
            </el-table-column>
            <el-table-column label="电话" prop="phone" show-overflow-tooltip></el-table-column>
            <el-table-column label="地址" prop="address" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="status" width="100">
                <template v-slot="{row}">
                    <span v-if="row.status == 1">无</span>
                    <span v-else>审核中</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip></el-table-column>
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