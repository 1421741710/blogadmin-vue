import './assets/main.scss'

import { createApp } from 'vue'
import Element1Plus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import {createPinia} from 'pinia'
import {createPersistedState} from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';



import App from './App.vue'
const app = createApp(App)
const pinia = createPinia()
const persist = createPersistedState()
app.use(Element1Plus, {locale})
app.use(router)
app.use(pinia)
app.component('QuillEditor',QuillEditor)
pinia.use(persist)
app.mount('#app')

