<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h2>环保公众监督系统</h2>
                <p>公众监督员登录</p>
            </div>

            <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-position="top">
                <el-form-item label="手机号" prop="tel_id">
                    <el-input
                        v-model="loginForm.tel_id"
                        placeholder="请输入手机号"
                        prefix-icon="el-icon-mobile-phone"
                    />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                        show-password
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        class="full-width"
                        :loading="loading"
                        @click="handleLogin"
                        >登录</el-button
                    >
                </el-form-item>

                <div class="login-options">
                    <span>还没有账号？<router-link to="/register">立即注册</router-link></span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { login, getUserInfo } from '../api/auth'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
    tel_id: '',
    password: '',
})

// 表单验证规则
const loginRules = reactive<FormRules>({
    tel_id: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 1, message: '密码不能为空', trigger: 'blur' },
    ],
})

// 处理登录
const handleLogin = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                const res = await login(loginForm) as any
                
                // 检查是否有错误
                if (res.error) {
                    ElMessage({
                        type: 'error',
                        message: res.error
                    })
                    return
                }
                
                // 登录成功，保存token
                if (res.token) {
                    localStorage.setItem('supervisor_token', res.token)
                    
                    // 获取完整的用户信息
                    try {
                        const userInfoRes = await getUserInfo() as any
                        if (userInfoRes) {
                            localStorage.setItem(
                                'supervisor_info',
                                JSON.stringify(userInfoRes)
                            )
                        } else {
                            // 如果获取用户信息失败，使用基本信息
                            localStorage.setItem(
                                'supervisor_info',
                                JSON.stringify({
                                    tel_id: loginForm.tel_id,
                                })
                            )
                        }
                    } catch (error) {
                        console.error('获取用户信息失败:', error)
                        // 如果获取用户信息失败，使用基本信息
                        localStorage.setItem(
                            'supervisor_info',
                            JSON.stringify({
                                tel_id: loginForm.tel_id,
                            })
                        )
                    }

                    ElMessage({
                        type: 'success',
                        message: res.message || '登录成功',
                    })

                    // 跳转到首页
                    router.push('/')
                } else {
                    ElMessage({
                        type: 'error',
                        message: '登录失败，未获取到token'
                    })
                }
            } catch (error: any) {
                console.error('登录失败:', error)
                ElMessage({
                    type: 'error',
                    message: error.response?.data?.error || error.message || '登录失败'
                })
            } finally {
                loading.value = false
            }
        }
    })
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--background-color);
}

.login-card {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-header h2 {
    font-size: 24px;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.login-header p {
    font-size: 16px;
    color: #606266;
}

.login-options {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    font-size: 14px;
    color: #606266;
}

.login-options a {
    color: var(--primary-color);
    text-decoration: none;
}
</style>
