<script setup>
    import {notificationsService, deleteNotificationsSerivce,notificationsUpdateService,notificationsInsertService} from '@/api/notifications/notifications.js'
    import {Memo, InfoFilled, Message} from '@element-plus/icons-vue'
    import {ref, onMounted, reactive} from "vue";
    import {ElMessage} from 'element-plus';
    import {articleInsertService, articleUpdateService} from "@/api/article/article.js";

    const notifications = ref([])
    const content = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const message = ref('')
    const formRef = ref(null)

    const handleSizeChange = async (number) => {
        pageSize.value = number
        await notificationsRequest()
    }
    const handleCurrentChange = async (number) => {
        currentPage.value = number
        await notificationsRequest()
    }

    const notificationsRequest = async () => {
        const data = {
            page: currentPage.value,
            pageSize: pageSize.value,
            content: content.value,
        }
        const result = await notificationsService(data)
        notifications.value = result.data.records
        total.value = result.data.total
    }
    onMounted(() => {
        notificationsRequest()
    })
    const form = ref({id: null, type: null, content: null})
    const drawer = ref(false)

    const reset = async () => {
        content.value = null
        await notificationsRequest()
    }

    const deleteNotifications = async (id) => {
        const result = await deleteNotificationsSerivce(id)
        ElMessage.success(result.msg)
        await notificationsRequest()
    }


    const beforeCloseHandler = (done) => {
        form.value = {}
        flag.value = false
        myQuillEditor.value.setHTML('')
        formRef.value.resetFields()
        done()
    }

    const flag = ref(false)

    const choose = async () => {
        if (form.value.content == '' || form.value.content == null){
            ElMessage.error('通知内容不能为空')
            return
        }
        const data = {
            id: form.value.id,
            type:2,
            content: form.value.content,
        }
        const json = JSON.stringify(data)
        const result = ref(null)
        if (flag.value) {
            result.value = await notificationsUpdateService(json)
        } else {
            result.value = await notificationsInsertService(json)
        }
        ElMessage.success(result.value.msg)
        formRef.value.resetFields()
        myQuillEditor.value.setHTML('')
        drawer.value = false
        await notificationsRequest()
    }

    const TiLength = ref(0)
    const myQuillEditor = ref(null)
    const editorOption = reactive({
        theme: "snow", // 主题
        // debug: 'info',
        placeholder: "请输入系统通知内容",
        modules: {
            toolbar: {
                container: [
                    // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
                    ['bold', 'italic', 'underline', 'strike'],
                    // 引用  代码块-----['blockquote', 'code-block']
                    ['blockquote', 'code-block'],
                    // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
                    [{header: 1}, {header: 2}],
                    // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
                    [{list: 'ordered'}, {list: 'bullet'}],
                    // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
                    [{script: 'sub'}, {script: 'super'}],
                    // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
                    [{indent: '-1'}, {indent: '+1'}],
                    // 文本方向-----[{'direction': 'rtl'}]
                    [{direction: 'rtl'}],
                    // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
                    [{size: ['small', false, 'large', 'huge']}],
                    // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
                    [{header: [1, 2, 3, 4, 5, 6, false]}],
                    // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
                    [{color: []}, {background: []}],
                    // 字体种类-----[{ font: [] }]
                    [{font: []}],
                    // 对齐方式-----[{ align: [] }]
                    [{align: []}],
                    // 清除文本格式-----['clean']
                    ['clean'],
                    // 链接、图片、视频-----['link', 'image', 'video']
                    ['image', 'video'],
                ] // 自定义工具栏选项
            },
        }
    })
    const onEditorChange = (e) => {
        TiLength.value = myQuillEditor.value.getText().length - 1
        if (TiLength.value > 1000) {
            myQuillEditor.value.setText(myQuillEditor.value.getText().slice(0, 1000))
            return
        }
    }
    const index = ref(false)
    const popup = (data) => {
        if (data){
            flag.value = true
            message.value = '编辑系统通知'
            form.value.id = data.id
            form.value.type = data.type
            form.value.content = data.content
            if (index.value){
                myQuillEditor.value.setHTML(form.value.content)
            }
            index.value = true
        }else{
            index.value = true
            message.value = '发送系统通知'
        }
        drawer.value = true
    }

</script>

<template>
    <el-card>
        <template #header>
            <div class="header">
                <span>系统通知管理</span>
                <div class="header-add">
                    <el-button type="primary" @click="popup(null)">发送系统通知</el-button>
                </div>
            </div>
        </template>
        <div class="mian">
            <span>通知内容</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="Memo" placeholder="请输入通知内容"
                      v-model="content" clearable></el-input>
            <el-button type="primary" @click="notificationsRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="notifications" border style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="账号" prop="username" width="150"></el-table-column>
            <el-table-column label="类型" prop="role" width="100">
                <template v-slot="{row}">
                    <span v-if="row.type == 1">指定</span>
                    <span v-else-if="row.type == 2">全部</span>
                </template>
            </el-table-column>
            <el-table-column label="通知内容" prop="content" show-overflow-tooltip>
                <template v-slot="{row}">
                    <span v-html="row.content"></span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100">
                <template v-slot="{row}">
                    <span v-if="row.status == 1">已读</span>
                    <span v-else-if="row.status == 2">未读</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300">
                <template v-slot="{row}">
                    <el-button type="info" @click="popup(row)" plain>编辑</el-button>
                    <el-popconfirm
                            cancel-button-text="取消"
                            confirm-button-text="确定"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                            :title="'你确定删除吗?'"
                            @confirm="deleteNotifications(row.id)">
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
        <el-drawer v-model="drawer" :before-close="beforeCloseHandler" size="1000" direction="rtl">
            <template #header>
                <h4>{{ message }}</h4>
            </template>
            <el-form
                    ref="formRef"
                    label-position="top"
                    label-width="100%"
                    :model="form"
            >
                <el-form-item label="通知类型">
                    <el-input style="width: 200px;" placeholder="全部" disabled/>
                </el-form-item>
                <el-form-item label="通知内容">
                    <div style="border: 1px solid #dcdfe6;">
                        <quill-editor
                                style="min-height: 500px;"
                                v-model:content="form.content"
                                ref="myQuillEditor"
                                contentType="html"
                                :options="editorOption"
                                @update:content="onEditorChange($event)">
                        </quill-editor>
                        <div class="editor_length">{{ TiLength }}/1000</div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 200px;" type="primary" @click="choose">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>


<style scoped>
    .header {
        display: flex;
        justify-content: left;
        align-items: center;
    }

    .header span {
        width: 50%;
    }

    .header-add {
        width: 50%;
        display: flex;
        justify-content: right;
    }

    .demo-pagination-block {
        margin-top: 20px;
    }

    .mian {
        margin: 10px 0 20px 0;
    }
    .editor_length {
        text-align: right;
    }
</style>