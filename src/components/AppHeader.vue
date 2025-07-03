<template>
    <el-header class="app-header">
        <div class="header-container">
            <div class="logo">
                <h1>环保公众监督系统</h1>
            </div>
            <div class="nav-menu">
                <el-menu
                    :default-active="activeIndex"
                    mode="horizontal"
                    router
                    background-color="transparent"
                    text-color="#333"
                    active-text-color="#409EFF"
                >
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/feedback">我的反馈</el-menu-item>
                    <el-menu-item index="/submit-feedback">提交反馈</el-menu-item>
                    <el-menu-item index="/aqi-info">空气质量指数</el-menu-item>
                </el-menu>
            </div>
            <div class="user-info">
                <template v-if="isLoggedIn">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="user-dropdown">
                            {{ userInfo.real_name || userInfo.name || userInfo.tel_id || '用户' }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                                <el-dropdown-item command="logout" divided
                                    >退出登录</el-dropdown-item
                                >
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
                <template v-else>
                    <el-button type="text" @click="$router.push('/login')">登录</el-button>
                    <el-button type="text" @click="$router.push('/register')">注册</el-button>
                </template>
            </div>
        </div>
    </el-header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUserInfo } from '../api/auth'

const router = useRouter()
const route = useRoute()

// 当前激活的菜单项
const activeIndex = computed(() => route.path)

// 用户信息
const userInfo = ref({
    name: '',
    real_name: '',
    tel_id: '',
    birthday: '',
    sex: -1
})

// 判断是否已登录
const isLoggedIn = computed(() => {
    return !!localStorage.getItem('supervisor_token')
})

// 初始化用户信息
onMounted(async () => {
    // 先从本地存储加载用户信息
    const storedUserInfo = localStorage.getItem('supervisor_info')
    if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo)
    }
    
    // 然后从服务器获取最新的用户信息
    try {
        const token = localStorage.getItem('supervisor_token')
        if (token) {
            const res = await getUserInfo() as any
            if (res) {
                // 更新用户信息
                userInfo.value = res
                // 更新本地存储
                localStorage.setItem('supervisor_info', JSON.stringify(res))
            }
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
    }
})

// 处理下拉菜单命令
const handleCommand = (command: string) => {
    if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                // 清除本地存储的token和用户信息
                localStorage.removeItem('supervisor_token')
                localStorage.removeItem('supervisor_info')

                ElMessage({
                    type: 'success',
                    message: '退出登录成功',
                })

                // 跳转到登录页
                router.push('/login')
            })
            .catch(() => {
                // 取消退出登录
            })
    } else if (command === 'profile') {
        router.push('/profile')
    }
}
</script>

<style scoped>
.app-header {
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    z-index: 1000;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
}

.logo h1 {
    margin: 0;
    font-size: 20px;
    color: var(--primary-color);
}

.nav-menu {
    flex: 1;
    margin: 0 20px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-dropdown {
    cursor: pointer;
    color: #333;
    font-size: 14px;
}

.user-dropdown:hover {
    color: var(--primary-color);
}

.el-menu {
    border-bottom: none !important;
}

.el-menu-item {
    font-size: 14px;
}
</style>
