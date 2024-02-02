<script setup>
    import {commentService,commentDeleteService} from '@/api/comment/comment.js'
    import { ChatDotRound,InfoFilled } from '@element-plus/icons-vue'
    import {ref,onMounted} from "vue";
    import {ElMessage} from 'element-plus';
    const comments = ref([])
    const comment = ref('')
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
    const commentRequest = async ()=>{
        const data = {
            page:currentPage.value,
            pageSize:pageSize.value,
            comment:comment.value,
        }
        const result = await commentService(data)
        comments.value = result.data.records
        total.value = result.data.total
    }
    onMounted(()=>{
        commentRequest()
    })

    //重置
    const reset = async () => {
        comment.value = ''
        await commentRequest()
    }

    //删除评论请求
    const deleteComment = async (id) => {
        // const json = JSON.stringify(id)
        const result = await commentDeleteService(id)
        ElMessage.success(result.msg)
        ids.value = []
        await commentRequest()
    }

    //单个删除评论
    const triggerDelete = (id) => {
        ids.value = []
        ids.value.push(id)
        deleteComment(ids.value)
    }

    //初始化记录批量删除评论的id
    const ids = ref([])

    //多选框
    const handleSelectionChange = (selection) => {
        ids.value = []
        selection.forEach((comment) => {
            ids.value.push(comment.id)
        })
    }

    //批量删除
    const batchDelete = () => {
        deleteComment(ids.value)
    }

</script>

<template>
    <el-card>
        <template #header>
            <div class="header">
                <span>文章评论管理</span>
                <div class="header-add">
                    <el-button type="danger" @click="batchDelete()">批量删除文</el-button>
                </div>
            </div>
        </template>
        <div class="mian">
            <span>文章评论</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="ChatDotRound" placeholder="请输入评论内容" v-model="comment" clearable></el-input>
            <el-button type="primary" @click="commentRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="comments" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="用户账号" prop="username"></el-table-column>
            <el-table-column label="文章" prop="articleTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="评论内容" prop="comment" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template v-slot="{row}">
                    <el-popconfirm
                            cancel-button-text="取消"
                            confirm-button-text="确定"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                            :title="'你确定要删除文章评论吗?'"
                            @confirm="triggerDelete(row.id)">
                        <template #reference>
                            <el-button type="danger" plain>删除</el-button>
                        </template>
                    </el-popconfirm>
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