<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h2>环保公众监督系统</h2>
                <p>公众监督员注册</p>
            </div>

            <el-form
                :model="registerForm"
                :rules="registerRules"
                ref="registerFormRef"
                label-position="top"
            >
                <el-form-item label="姓名" prop="name">
                    <el-input
                        v-model="registerForm.name"
                        placeholder="请输入姓名"
                        prefix-icon="el-icon-user"
                    />
                </el-form-item>

                <el-form-item label="手机号" prop="tel_id">
                    <el-input
                        v-model="registerForm.tel_id"
                        placeholder="请输入手机号"
                        prefix-icon="el-icon-mobile-phone"
                    />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="registerForm.password"
                        type="password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                        show-password
                    />
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input
                        v-model="registerForm.confirmPassword"
                        type="password"
                        placeholder="请再次输入密码"
                        prefix-icon="el-icon-lock"
                        show-password
                    />
                </el-form-item>

                <el-form-item label="生日" prop="birthday">
                    <el-date-picker
                        v-model="registerForm.birthday"
                        type="date"
                        placeholder="选择生日"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                    />
                </el-form-item>

                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="registerForm.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        class="full-width"
                        :loading="loading"
                        @click="handleRegister"
                        >注册</el-button
                    >
                </el-form-item>

                <div class="register-options">
                    <span>已有账号？<router-link to="/login">立即登录</router-link></span>
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
import { register } from '../api/auth'

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

// 注册表单数据
const registerForm = reactive({
    name: '',
    tel_id: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    sex: 1, // 默认为男性(1)，女性为0
})

// 密码确认验证
const validatePass = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

// 表单验证规则
const registerRules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' },
    ],
    tel_id: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, message: '密码长度不能小于3位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' },
    ],
})

// 处理注册
const handleRegister = async () => {
    if (!registerFormRef.value) return

    await registerFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                const { confirmPassword, name, ...otherData } = registerForm
                const registerData = {
                    ...otherData,
                    real_name: name,
                    // 如果生日为空，则不传递该字段
                    birthday: registerForm.birthday || undefined
                }
                console.log('注册数据:', registerData)
                const res = await register(registerData) as any

                // 检查是否有错误
                if (res.error) {
                    ElMessage({
                        type: 'error',
                        message: res.error
                    })
                    return
                }

                ElMessage({
                    type: 'success',
                    message: res.message || '注册成功，请登录',
                })

                // 跳转到登录页
                router.push('/login')
            } catch (error: any) {
                console.error('注册失败:', error)
                ElMessage({
                    type: 'error',
                    message: error.response?.data?.error || error.message || '注册失败'
                })
            } finally {
                loading.value = false
            }
        }
    })
}
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--background-color);
}

.register-card {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-header {
    text-align: center;
    margin-bottom: 30px;
}

.register-header h2 {
    font-size: 24px;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.register-header p {
    font-size: 16px;
    color: #606266;
}

.register-options {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    font-size: 14px;
    color: #606266;
}

.register-options a {
    color: var(--primary-color);
    text-decoration: none;
}
</style>
