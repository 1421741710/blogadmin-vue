<script setup>
    import Aside from '@/views/Aside.vue'
    import Header from '@/views/Header.vue'
    import {ref,onUnmounted} from "vue";
    import { ElNotification } from 'element-plus'
    import {useStore} from '@/stores/store.js'
    import { createWebSocket } from '@/utils/websocket.js'
    const open = (msg) =>{
        ElNotification({
            title: '系统通知',
            dangerouslyUseHTMLString: true,
            message: msg,
        })
    }
    const receivedMessage = ref(null)
    const handleMessage = (type,messageData) => {
        const data = JSON.parse(messageData)
        if (type === 'RealTimeStatistics'){
            const da = {
                type:'RealTimeStatistics',
                data:data
            }
            receivedMessage.value = da
        }
        const content = data.content
        open(content)
    }
    // const idStore = useIdStore()
    const store = useStore()

    const ws = createWebSocket('ws:'+location.host+'/socket/ws/admin'+store.admin.id,handleMessage)
    onUnmounted(()=>{
        //关闭WebSocket连接
        ws.close()
    })

</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <Aside></Aside>
            </el-aside>
            <el-container>
                <el-header style="padding: 0;">
                    <Header></Header>
                </el-header>
                <el-main>
                    <router-view :receivedMessage="receivedMessage" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped>

</style>