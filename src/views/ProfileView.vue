<template>
    <AppLayout>
        <div class="profile-container">
            <h2 class="page-title">个人资料</h2>
            
            <el-card class="profile-card">
                <template #header>
                    <div class="card-header">
                        <h3>基本信息</h3>
                    </div>
                </template>
                
                <div class="profile-info">
                    <div class="info-item">
                        <span class="info-label">姓名：</span>
                        <span>{{ userInfo.real_name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">手机号：</span>
                        <span>{{ userInfo.tel_id }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">性别：</span>
                        <span>{{ userInfo.sex === 0 ? '女' : userInfo.sex === 1 ? '男' : '未设置' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">生日：</span>
                        <span>{{ userInfo.birthday || '未设置' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">账号类型：</span>
                        <span>公众监督员</span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <el-button type="danger" @click="showDeleteConfirm">删除账号</el-button>
                </div>
            </el-card>
            
            
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import AppLayout from '../components/AppLayout.vue'
import { deleteSelf, getUserInfo } from '../api/auth'

const router = useRouter()
const passwordFormRef = ref<FormInstance>()
const loading = ref(false)

// 用户信息
const userInfo = ref({
    real_name: '',
    tel_id: '',
    birthday: '',
    sex: -1 // 性别，0为女性，1为男性，-1为未设置
})

// 密码表单
const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 密码确认验证
const validatePass = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

// 加载用户信息
const loadUserInfo = async () => {
    const storedUserInfo = localStorage.getItem('supervisor_info')
    console.log('从 localStorage 获取的原始用户信息:', storedUserInfo)
    
    // 先从 localStorage 加载基本信息
    if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo)
    }
    
    // 然后从服务器重新获取最新的用户信息
    try {
        const token = localStorage.getItem('supervisor_token')
        if (token) {
            const res = await getUserInfo() as any
            if (res) {
                // 更新用户信息
                userInfo.value = res
                // 更新本地存储
                localStorage.setItem('supervisor_info', JSON.stringify(res))
                console.log('从服务器获取的用户信息:', res)
            }
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
    }
    
    // 打印最终的用户信息
    console.log('最终的用户信息对象:', userInfo.value)
    console.log('姓名 (real_name):', userInfo.value.real_name)
    console.log('手机号 (tel_id):', userInfo.value.tel_id)
    console.log('生日 (birthday):', userInfo.value.birthday)
    console.log('性别 (sex):', userInfo.value.sex, userInfo.value.sex === 0 ? '女性' : userInfo.value.sex === 1 ? '男性' : '未设置')
}

// 显示删除账号确认
const showDeleteConfirm = () => {
    ElMessageBox.confirm(
        '删除账号后，您的所有数据将被清除，且无法恢复。确定要删除账号吗？',
        '警告',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        deleteAccount()
    }).catch(() => {
        // 取消删除
    })
}

// 删除账号
const deleteAccount = async () => {
    try {
        await deleteSelf()
        
        // 清除本地存储的token和用户信息
        localStorage.removeItem('supervisor_token')
        localStorage.removeItem('supervisor_info')
        
        ElMessage({
            type: 'success',
            message: '账号已成功删除'
        })
        
        // 跳转到登录页
        router.push('/login')
    } catch (error) {
        console.error('删除账号失败:', error)
    }
}

// 检查登录状态
const checkLogin = () => {
    const token = localStorage.getItem('supervisor_token')
    if (!token) {
        ElMessage({
            type: 'warning',
            message: '请先登录'
        })
        router.push('/login')
        return false
    }
    return true
}

// 页面加载时执行
onMounted(() => {
    if (checkLogin()) {
        loadUserInfo()
    }
})
</script>

<style scoped>
.profile-container {
    max-width: 600px;
    margin: 0 auto;
}

.page-title {
    margin-bottom: 20px;
    color: #303133;
}

.profile-card {
    margin-bottom: 20px;
}

.card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
}

.profile-info {
    padding: 10px 0;
}

.info-item {
    margin-bottom: 15px;
    line-height: 1.6;
}

.info-label {
    font-weight: bold;
    margin-right: 10px;
    color: #606266;
}

.profile-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.mt-20 {
    margin-top: 20px;
}
</style>
