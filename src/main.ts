import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入全局样式
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
    size: 'default',
})

app.mount('#app')
