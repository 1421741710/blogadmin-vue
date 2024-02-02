<script setup>
    import {
        Document,
        Location,
        Setting,
        Tickets,
        House,
        DocumentRemove,
        User,
        Bell,
        Avatar
    } from '@element-plus/icons-vue'
    import {useRoute} from 'vue-router'
    import {useStore} from '@/stores/store.js'
    import {ref} from "vue";
    const store = useStore()
    const role = store.admin.role
    const flag = role == 1
    const route = useRoute()
    const path = ref('/statistical/info')
    const getCurrentRoute = () => {
        const paths = route.path
        if (paths !== '/'){
            path.value = paths
        }
    }
    getCurrentRoute()
</script>
<template>
    <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            :default-active="path"
            style="height: 100vh"
            text-color="#fff"
            router>
        <img src="@/assets/logo2.png"/>
        <el-menu-item index="/statistical/info">
            <el-icon>
                <House/>
            </el-icon>
            <span>系统首页</span>
        </el-menu-item>
        <el-sub-menu index="/admin" v-show="flag">
            <template #title>
                <el-icon>
                    <Avatar/>
                </el-icon>
                <span>管理员管理</span>
            </template>
            <el-menu-item index="/admin/info">
                <span>管理员账号</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/user" v-show="flag">
            <template #title>
                <el-icon>
                    <User/>
                </el-icon>
                <span>用户管理</span>
            </template>
            <el-menu-item index="/user/info">
                <span>用户账号</span>
            </el-menu-item>
            <el-menu-item index="/user/infos">
                <span>用户信息</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/article">
            <template #title>
                <el-icon>
                    <Document/>
                </el-icon>
                <span>文章管理</span>
            </template>
            <el-menu-item index="/article/info">
                <span>文章信息</span>
            </el-menu-item>
            <el-menu-item index="/article/comment">
                <span>文章评论</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/process">
            <template #title>
                <el-icon>
                    <Tickets/>
                </el-icon>
                <span>审核管理</span>
            </template>
            <el-menu-item index="/process/info">
                <span>审核信息</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/notifications">
            <template #title>
                <el-icon>
                    <Bell/>
                </el-icon>
                <span>系统通知管理</span>
            </template>
            <el-menu-item index="/notifications/info">
                <span>系统通知信息</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/log" v-show="flag">
            <template #title>
                <el-icon>
                    <DocumentRemove/>
                </el-icon>
                <span>系统日志管理</span>
            </template>
            <el-menu-item index="/log/info">
                <span>系统日志信息</span>
            </el-menu-item>
        </el-sub-menu>

    </el-menu>
</template>

<style scoped>
    img{
        width: 200px;
        height: 150px;
    }
</style>