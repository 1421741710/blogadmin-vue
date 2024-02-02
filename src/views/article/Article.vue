<script setup>
    import {
        articleListService,
        articleDeleteService,
        articleUpdateService,
        articleInsertService
    } from '@/api/article/article.js'
    import {InfoFilled, Document, Plus} from '@element-plus/icons-vue'
    import {ref, onMounted, reactive, nextTick} from "vue";
    import {ElMessage} from 'element-plus';

    const admins = ref([])
    const title = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)

    //分页显示
    const handleSizeChange = async (number) => {
        pageSize.value = number
        await articleRequest()
    }
    //分页页数
    const handleCurrentChange = async (number) => {
        currentPage.value = number
        await articleRequest()
    }

    //获取分页查询
    const articleRequest = async () => {
        const data = {
            page: currentPage.value,
            pageSize: pageSize.value,
            title: title.value,
        }
        const result = await articleListService(data)
        admins.value = []
        admins.value = result.data.records
        total.value = result.data.total
    }

    //钩子函数
    onMounted(() => {
        articleRequest()
    });

    //初始化查看文章数据
    const form = ref({
        id: null,
        title: null,
        secondary: null,
        content: null,
        img: null,
        likes: null,
        createTime: null,
        updateTime: null
    })
    //初始化第一个抽屉(查看文章详情)
    const drawer = ref(false)
    //form表单验证
    const roles = {
        title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'},
            {min: 5, max: 100, message: '长度为5~100位非空字符', trigger: 'blur'}
        ],
        secondary: [
            {required: true, message: '请输入文章副标题', trigger: 'blur'},
            {min: 5, max: 300, message: '长度为5~300位非空字符', trigger: 'blur'}
        ],
        content: [
            {required: true, message: '请输入文章内容', trigger: 'blur'},
            {min: 10, max: 5000, message: '长度为10~5000位非空字符', trigger: 'blur'}
        ],
        img: [
            {required: true, message: '请选择图片', trigger: 'blur'}
        ]
    }
    //重置
    const reset = () => {
        title.value = null
        articleRequest()
    }
    //提交
    const choose = async () => {
        const data = {
            id: forms.value.id,
            title: forms.value.title,
            secondary: forms.value.secondary,
            content: forms.value.content,
            img: forms.value.img
        }
        const json = JSON.stringify(data)
        const result = ref(null)
        if (flag.value) {
            result.value = await articleUpdateService(json)
        } else {
            result.value = await articleInsertService(json)
        }
        await articleRequest()
        ElMessage.success(result.value.msg)
    }
    //form表单的ref
    const formsRef = ref(null)
    //重置表单验证
    const beforeCloseHandler = (done) => {
        document.querySelector('.el-drawer__body').scrollTo(0, 0)
        myQuillEditor.value.setHTML('')
        flag.value = false
        formsRef.value.resetFields()
        forms.value = {}
        imageFlag.value = null
        drawers.value = false
        done()
    }

    const beforeCloseHandlerOne = (done) => {
        document.querySelector('.el-drawer__body').scrollTo(0, 0)
        done()
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

    //查看文章详情
    const checkArticle = (data) => {
        drawer.value = true
        form.value = data
        nextTick(() => {
            const contentElement = document.querySelectorAll('.ql-syntax')
            contentElement.forEach((block) => {
                hljs.highlightElement(block)
                block.setAttribute('style','padding:20px;')
            })
        })
    }
    //删除文章
    const deleteArticle = async (id) => {
        const result = await articleDeleteService(id)
        ElMessage.success(result.msg)
        await articleRequest()
    }
    // 代码高亮
    import hljs from 'highlight.js';
    // 在组件的<script setup>或<script>标签内
    import 'highlight.js/styles/agate.css';

    const drawers = ref(false)
    const message = ref('')
    //初始化修改和添加的数据
    const forms = ref({
        id: null,
        title: null,
        secondary: null,
        content: null,
        img: null
    })
    const index = ref(false)
    //抽屉标识决定添加或者修改操作
    const flag = ref(false)
    //初始化第二抽屉(添加/修改)
    const popup = (data) => {
        drawers.value = true
        if (data) {
            forms.value.id = data.id
            forms.value.title = data.title
            forms.value.secondary = data.secondary
            forms.value.content = data.content
            if (index.value){
                myQuillEditor.value.setHTML(forms.value.content)
            }
            forms.value.img = data.img
            imageFlag.value = data.img
            message.value = '编辑文章'
            flag.value = true
            index.value = true
        } else {
            index.value = true
            forms.value.title = null
            forms.value.secondary = null
            forms.value.content = null
            forms.value.img
            message.value = '添加文章'
        }
    }

    import {uploadService} from '@/api/upload/upload.js'

    //初始化上传图片回显
    const imageFlag = ref(null)
    //上传图片
    const beforeAvatarUpload = async (open) => {
        const result = await uploadService(open.file)
        forms.value.img = result.data
        imageFlag.value = forms.value.img
        ElMessage.success(result.msg)
    }
    const TiLength = ref(0)
    const myQuillEditor = ref(null)
    const editorOption = reactive({
        theme: "snow", // 主题
        // debug: 'info',
        placeholder: "请输入文章内容",
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
        if (TiLength.value > 5000) {
            myQuillEditor.value.setText(myQuillEditor.value.getText().slice(0, 5000))
            return
        }
    }

</script>

<template>
    <el-card>
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="header-add">
                    <el-button type="primary" @click="popup(null)">添加文章</el-button>
                </div>
            </div>
        </template>
        <div class="mian">
            <span>文章标题</span>
            <el-input style="width: 200px;margin: 0 20px 0 10px;" :prefix-icon="Document" placeholder="请输入文章标题"
                      v-model="title" clearable></el-input>
            <el-button type="primary" @click="articleRequest">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
        <el-table :data="admins" border style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="副标题" prop="secondary" show-overflow-tooltip></el-table-column>
            <el-table-column label="内容" prop="content" show-overflow-tooltip>
                <template v-slot="{row}">
                    <span v-if="row.content.length > 100">内容过长</span>
                </template>
            </el-table-column>
            <el-table-column label="图片" prop="img" width="100">
                <template v-slot="{row}">
                    <el-image style="width: 30px; height: 30px"
                              :src="row.img" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                              @click="handlePreview(row.img)" :initial-index="4" fit="fill"
                              :hide-on-click-modal="true"/>
                </template>
            </el-table-column>
            <el-table-column label="点赞数" prop="likes" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300">
                <template v-slot="{row}">
                    <el-button type="success" @click="checkArticle(row)" plain>查看</el-button>
                    <el-button type="info" @click="popup(row)" plain>编辑</el-button>
                    <el-popconfirm
                            cancel-button-text="取消"
                            confirm-button-text="确定"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                            :title="'你确定删除吗?'"
                            @confirm="deleteArticle(row.id)">
                        <template #reference>
                            <el-button type="danger" plain>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-image-viewer v-if="isPreviewActive" @close="handleClose" :url-list="[previewImageUrl]"/>
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
        <el-drawer class="check-item" :before-close="beforeCloseHandlerOne" size="1000" v-model="drawer"
                   direction="rtl">
            <template #header>
                <h4>查看文章详细</h4>
            </template>
            <div>
                <h1>文章标题:</h1>
                <span v-html="form.title"></span>
            </div>
            <div>
                <h1>文章副标题:</h1>
                <span v-html="form.secondary"></span>
            </div>
            <div>
                <h1>文章内容:</h1>
                <p class="content" style="border: 1px solid #cdcdcd;padding: 10px;" v-html="form.content"></p>
            </div>
            <div>
                <h1>文章图片:</h1>
                <img width="250" :src="form.img"/>
            </div>
            <div>
                <h2>文章点赞:</h2>
                <span>{{ form.likes }}个</span><br>
                <h2>文章创建时间:</h2>
                <span>{{ form.createTime }}</span><br>
                <h2>文章修改时间:</h2>
                <span>{{ form.updateTime }}</span>
            </div>
        </el-drawer>
        <el-drawer v-model="drawers" :before-close="beforeCloseHandler" size="1000" direction="rtl">
            <template #header>
                <h4>{{ message }}</h4>
            </template>
            <el-form
                    ref="formsRef"
                    label-position="top"
                    label-width="100%"
                    :model="forms"
                    style="overflow: auto;"
                    :rules="roles"
            >
                <el-form-item label="文章标题" prop="title">
                    <el-input type="textarea" v-model="forms.title" placeholder="请输入文章标题"/>
                </el-form-item>
                <el-form-item label="文章副标题" prop="secondary">
                    <el-input type="textarea" v-model="forms.secondary" placeholder="请输入文章副标题"/>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <div style="border: 1px solid #dcdfe6;">
                        <quill-editor
                                style="min-height: 500px;"
                                v-model:content="forms.content"
                                ref="myQuillEditor"
                                contentType="html"
                                :options="editorOption"
                                @update:content="onEditorChange($event)">
                        </quill-editor>
                        <div class="editor_length">{{ TiLength }}/5000</div>
                    </div>
                </el-form-item>
                <el-form-item label="文章展示图片" prop="img">
                    <el-upload
                            class="avatar-uploader"
                            :http-request="beforeAvatarUpload"
                            :show-file-list="false"
                    >
                        <img v-if="imageFlag" :src="forms.img" class="avatar"/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus/>
                        </el-icon>
                    </el-upload>
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

    .check-item h1 {
        font-size: 25px;
    }

    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .editor_length {
        text-align: right;
    }
</style>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
</style>