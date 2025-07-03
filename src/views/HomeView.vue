<template>
    <AppLayout>
        <div class="home-container">
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="welcome-banner">
                        <h1>欢迎使用环保公众监督系统</h1>
                        <p>您的参与将促进环境保护与改善空气质量</p>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="mt-20">
                <el-col :span="8">
                    <el-card class="feature-card">
                        <template #header>
                            <div class="card-header">
                                <h3>提交反馈</h3>
                            </div>
                        </template>
                        <div class="card-content">
                            <p>发现环保问题？立即提交反馈，帮助改善环境。</p>
                            <el-button type="primary" @click="$router.push('/submit-feedback')"
                                >去提交</el-button
                            >
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="8">
                    <el-card class="feature-card">
                        <template #header>
                            <div class="card-header">
                                <h3>我的反馈</h3>
                            </div>
                        </template>
                        <div class="card-content">
                            <p>查看您提交的所有反馈及其处理状态。</p>
                            <el-button type="primary" @click="$router.push('/feedback')"
                                >查看列表</el-button
                            >
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="8">
                    <el-card class="feature-card">
                        <template #header>
                            <div class="card-header">
                                <h3>空气质量指数</h3>
                            </div>
                        </template>
                        <div class="card-content">
                            <p>了解空气质量指数级别及其对健康的影响。</p>
                            <el-button type="primary" @click="$router.push('/aqi-info')"
                                >查看详情</el-button
                            >
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="mt-20">
                <el-col :span="24">
                    <el-card>
                        <template #header>
                            <div class="card-header">
                                <h3>关于环保公众监督系统</h3>
                            </div>
                        </template>
                        <div class="about-content">
                            <p>
                                环保公众监督系统是一个面向公众的环境监督平台，方便公众参与环境保护工作。系统主要功能包括：
                            </p>
                            <ul>
                                <li>
                                    公众可以提交环保相关反馈，包含地理位置、详细信息和预估空气质量等级
                                </li>
                                <li>系统管理员将反馈任务指派给网格员进行处理</li>
                                <li>公众可以实时查看自己提交的反馈处理状态</li>
                                <li>提供空气质量指数相关信息，帮助公众了解环境状况</li>
                            </ul>
                            <p>
                                您的参与将有助于改善我们的生活环境，让我们共同创造一个更加清洁、健康的家园。
                            </p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 检查登录状态
// 如果未登录，重定向到登录页面
onMounted(() => {
    const token = localStorage.getItem('supervisor_token')
    if (!token) {
        router.push('/login')
    }
})
</script>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-banner {
    background-color: var(--primary-color);
    color: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 20px;
}

.welcome-banner h1 {
    font-size: 28px;
    margin-bottom: 10px;
}

.welcome-banner p {
    font-size: 16px;
    opacity: 0.9;
}

.feature-card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
}

.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

.card-content p {
    margin-bottom: 20px;
    color: #606266;
}

.about-content {
    color: #606266;
    line-height: 1.6;
}

.about-content ul {
    padding-left: 20px;
    margin: 15px 0;
}

.about-content li {
    margin-bottom: 8px;
}
</style>
