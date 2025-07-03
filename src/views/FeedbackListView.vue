<template>
    <AppLayout>
        <div class="feedback-list-container">
            <h2 class="page-title">我的反馈列表</h2>

            <el-card class="feedback-list-card">
                <template #header>
                    <div class="card-header">
                        <div class="header-title">
                            <h3>我提交的环保反馈</h3>
                        </div>
                        <div class="header-actions">
                            <el-button type="primary" @click="$router.push('/submit-feedback')"
                                >提交新反馈</el-button
                            >
                            <el-button @click="refreshList"
                                ><el-icon><Refresh /></el-icon> 刷新</el-button
                            >
                        </div>
                    </div>
                </template>

                <el-table
                    v-loading="loading"
                    :data="feedbackList"
                    style="width: 100%"
                    border
                    stripe
                >
                    <el-table-column prop="id" label="ID" width="80" />
                    <el-table-column label="地点" min-width="200">
                        <template #default="scope">
                            {{ scope.row.province_name }} {{ scope.row.city_name }}
                            {{ scope.row.address }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="information"
                        label="反馈信息"
                        min-width="250"
                        show-overflow-tooltip
                    />
                    <el-table-column label="提交时间" width="180">
                        <template #default="scope">
                            {{ formatDate(scope.row.af_date, scope.row.af_time) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="空气质量等级" width="150">
                        <template #default="scope">
                            <el-tag
                                :style="{
                                    backgroundColor: getAqiColor(scope.row.estimated_grade),
                                    color: '#fff',
                                    border: 'none',
                                }"
                            >
                                {{ getAqiExplain(scope.row.estimated_grade) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template #default="scope">
                            <el-tag :type="getFeedbackStatusType(scope.row.state)">
                                {{ getFeedbackStatusText(scope.row.state) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template #default="scope">
                            <el-button
                                type="primary"
                                size="small"
                                @click="viewFeedbackDetail(scope.row)"
                            >
                                查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="empty-data" v-if="feedbackList.length === 0 && !loading">
                    <el-empty description="暂无反馈数据">
                        <el-button type="primary" @click="$router.push('/submit-feedback')"
                            >去提交反馈</el-button
                        >
                    </el-empty>
                </div>
            </el-card>

            <!-- 反馈详情对话框 -->
            <el-dialog v-model="dialogVisible" title="反馈详情" width="600px">
                <div v-if="currentFeedback" class="feedback-detail">
                    <div class="detail-item">
                        <span class="detail-label">反馈ID：</span>
                        <span>{{ currentFeedback.id }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">提交时间：</span>
                        <span>{{ formatDate(currentFeedback.created_at) }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">地点：</span>
                        <span
                            >{{ currentFeedback.province_name }} {{ currentFeedback.city_name }}
                            {{ currentFeedback.address }}</span
                        >
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">反馈信息：</span>
                        <span>{{ currentFeedback.information }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">空气质量等级：</span>
                        <el-tag
                            :style="{
                                backgroundColor: getAqiColor(currentFeedback.estimated_grade),
                                color: '#fff',
                                border: 'none',
                            }"
                        >
                            {{ getAqiExplain(currentFeedback.estimated_grade) }}
                        </el-tag>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">当前状态：</span>
                        <el-tag :type="getFeedbackStatusType(currentFeedback.state)">
                            {{ getFeedbackStatusText(currentFeedback.state) }}
                        </el-tag>
                    </div>

                    <div class="detail-item" v-if="currentFeedback.grid_member_name">
                        <span class="detail-label">处理人员：</span>
                        <span>{{ currentFeedback.grid_member_name }}</span>
                    </div>

                    <div class="detail-item" v-if="currentFeedback.result">
                        <span class="detail-label">处理结果：</span>
                        <span>{{ currentFeedback.result }}</span>
                    </div>
                </div>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">关闭</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import AppLayout from '../components/AppLayout.vue'
import { getFeedbackList } from '../api/feedback'

const router = useRouter()
const loading = ref(false)
const feedbackList = ref<any[]>([])
const dialogVisible = ref(false)
const currentFeedback = ref<any>(null)

// 获取空气质量等级颜色
const getAqiColor = (grade: number) => {
    switch (grade) {
        case 1: return '#00e400' // 优
        case 2: return '#ffff00' // 良
        case 3: return '#ff7e00' // 轻度污染
        case 4: return '#ff0000' // 中度污染
        case 5: return '#99004c' // 重度污染
        case 6: return '#7e0023' // 严重污染
        default: return '#909399' // 未知
    }
}

// 获取空气质量等级说明
const getAqiExplain = (grade: number) => {
    switch (grade) {
        case 1: return '优'
        case 2: return '良'
        case 3: return '轻度污染'
        case 4: return '中度污染'
        case 5: return '重度污染'
        case 6: return '严重污染'
        default: return '未知'
    }
}

// 获取反馈列表
const loadFeedbackList = async () => {
    loading.value = true
    try {
        const res = await getFeedbackList()
        feedbackList.value = res.data || []
    } catch (error) {
        console.error('获取反馈列表失败:', error)
    } finally {
        loading.value = false
    }
    console.log(feedbackList.value)
}

// 刷新列表
const refreshList = () => {
    loadFeedbackList()
}

// 查看反馈详情
const viewFeedbackDetail = (feedback: any) => {
    currentFeedback.value = feedback
    dialogVisible.value = true
}

// 格式化日期
const formatDate = (dateStr: string, timeStr?: string) => {
    if (!dateStr) return ''
    return timeStr ? `${dateStr} ${timeStr}` : dateStr
}

// 获取反馈状态文本
const getFeedbackStatusText = (state: number) => {
    switch (state) {
        case 0:
            return '未指派'
        case 1:
            return '已指派'
        case 2:
            return '已完成'
        default:
            return '未知状态'
    }
}

// 获取反馈状态标签类型
const getFeedbackStatusType = (state: number) => {
    switch (state) {
        case 0:
            return 'info'
        case 1:
            return 'warning'
        case 2:
            return 'primary'
        case 3:
            return 'success'
        default:
            return 'info'
    }
}

// 检查登录状态
const checkLogin = () => {
    const token = localStorage.getItem('supervisor_token')
    if (!token) {
        ElMessage({
            type: 'warning',
            message: '请先登录',
        })
        router.push('/login')
        return false
    }
    return true
}

// 页面加载时执行
onMounted(() => {
    if (checkLogin()) {
        loadFeedbackList()
    }
})
</script>

<style scoped>
.feedback-list-container {
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    margin-bottom: 20px;
    color: #303133;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
}

.empty-data {
    padding: 30px 0;
    text-align: center;
}

.feedback-detail {
    padding: 10px;
}

.detail-item {
    margin-bottom: 15px;
    line-height: 1.6;
}

.detail-label {
    font-weight: bold;
    margin-right: 10px;
    color: #606266;
}
</style>
