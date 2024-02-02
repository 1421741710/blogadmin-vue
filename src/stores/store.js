import {defineStore} from 'pinia'
import {ref} from 'vue'


/*
    defineStore参数描述:
        第一个参数:给状态名起名,具有唯一性
        第二个参数:函数,可以把定义该状态中拥有的内容

    defineStore返回值描述:
        返回的是一个函数,将来可以调用该函数,得到第二个参数中返回的内容
 */
export const useStore = defineStore('admin',()=>{
    //1.定义描述token
    const admin = ref({
        id:null,
        username:null,
        role:null,
        token:null
    })

    //2.定义修改token的方法
    const setStore = (newAdmin)=>{
        admin.value.id = newAdmin.id
        admin.value.username = newAdmin.username
        admin.value.role = newAdmin.role
        admin.value.token = newAdmin.token
    }

    //3.定义移除token的方法
    const removeStore = ()=>{
        admin.value.id = ''
        admin.value.username = ''
        admin.value.role = ''
        admin.value.token = ''
    }

    return {
        admin,setStore,removeStore
    }

},{
    persist:true //持久化存储
})
