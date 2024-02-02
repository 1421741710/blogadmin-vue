import {createRouter,createWebHistory} from 'vue-router'

import LoginVue from '@/views/Login.vue'
import HomeVue from '@/views/Home.vue'
import AdminVue from '@/views/admin/Admin.vue'
import UserVue from '@/views/user/User.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import StatisticalVue from '@/views/statistical/Statistical.vue'
import ArticleVue from '@/views/article/Article.vue'
import CommentVue from '@/views/comment/Comment.vue'
import ProcessVue from '@/views/process/Process.vue'
import NotificationsVue from '@/views/notifications/Notifications.vue'
import LogVue from '@/views/log/Log.vue'

//定义路由关系
const routes = [
    {path: '/login',component:LoginVue},
    {
        path: '/',
        component: HomeVue,
        children: [
            {
              path: '/statistical/info',
              component: StatisticalVue
            },
            {
                path: '/admin/info',
                component: AdminVue
            },
            {
                path: '/user/info',
                component: UserVue
            },
            {
                path: '/user/infos',
                component: UserInfoVue
            },
            {
                path: '/article/info',
                component: ArticleVue
            },
            {
                path: '/article/comment',
                component: CommentVue
            },
            {
                path: '/process/info',
                component: ProcessVue
            },
            {
                path: '/notifications/info',
                component: NotificationsVue
            },
            {
                path: '/log/info',
                component: LogVue
            }
        ],
        redirect: '/statistical/info'
    }
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router