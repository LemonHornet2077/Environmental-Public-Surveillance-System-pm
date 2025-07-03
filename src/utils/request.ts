import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1', // API的基础URL
    timeout: 15000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 从localStorage获取token
        const token = localStorage.getItem('supervisor_token')
        // 如果token存在，则在请求头中添加token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    },
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 直接返回响应数据，让业务代码处理
        return response.data
    },
    (error) => {
        console.error('响应错误:', error)
        // 处理网络错误
        let message = '网络错误，请稍后重试'
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = '未授权，请重新登录'
                    // 清除token并跳转到登录页
                    localStorage.removeItem('supervisor_token')
                    router.push('/login')
                    break
                case 403:
                    message = '拒绝访问'
                    break
                case 404:
                    message = '请求的资源不存在'
                    break
                case 500:
                    message = '服务器内部错误'
                    break
                default:
                    message = `请求失败: ${error.response.status}`
            }
        }

        ElMessage({
            message: message,
            type: 'error',
            duration: 5 * 1000,
        })

        return Promise.reject(error)
    },
)

export default service
