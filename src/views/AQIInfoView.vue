<template>
    <AppLayout>
        <div class="aqi-info-container">
            <h2 class="page-title">空气质量指数(AQI)信息</h2>

            <el-card class="aqi-info-card">
                <template #header>
                    <div class="card-header">
                        <h3>空气质量指数级别及健康影响</h3>
                    </div>
                </template>

                <div v-loading="loading">
                    <el-table :data="aqiList" style="width: 100%" border stripe>
                        <el-table-column label="AQI级别" width="120">
                            <template #default="scope">
                                <div class="aqi-level">
                                    <span
                                        class="aqi-color"
                                        :style="{ backgroundColor: scope.row.color }"
                                    ></span>
                                    <span>{{ scope.row.aqi_explain }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="chinese_explain" label="中文说明" width="120" />
                        <el-table-column
                            prop="health_impact"
                            label="健康影响"
                            min-width="250"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="take_steps"
                            label="建议措施"
                            min-width="250"
                            show-overflow-tooltip
                        />
                        <el-table-column label="污染物浓度范围" min-width="200">
                            <template #default="scope">
                                <div>
                                    PM2.5: {{ scope.row.pm25_min }}-{{ scope.row.pm25_max }} μg/m³
                                </div>
                                <div>
                                    PM10: {{ scope.row.pm10_min }}-{{ scope.row.pm10_max }} μg/m³
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="empty-data" v-if="aqiList.length === 0 && !loading">
                        <el-empty description="暂无AQI数据">
                            <el-button type="primary" @click="loadAQIList">重新加载</el-button>
                        </el-empty>
                    </div>
                </div>
            </el-card>

            <el-card class="aqi-info-card mt-20">
                <template #header>
                    <div class="card-header">
                        <h3>什么是空气质量指数(AQI)?</h3>
                    </div>
                </template>

                <div class="aqi-explanation">
                    <p>
                        空气质量指数（Air Quality
                        Index，简称AQI）是定量描述空气质量状况的指数，是各项污染物浓度数据转化为单一概念的指数值，以便于公众理解。
                    </p>

                    <h4>AQI的计算方法</h4>
                    <p>
                        AQI是由监测六项主要污染物（PM2.5、PM10、SO2、NO2、O3、CO）的浓度计算得出的。当某一项污染物的AQI大于50时，该项污染物为首要污染物。当AQI大于100时，该项污染物为超标污染物。
                    </p>

                    <h4>AQI的意义</h4>
                    <p>
                        AQI值越大，表示空气污染程度越重，对人体健康的危害也就越大。AQI的划分标准主要考虑了污染物对人体健康的影响，以及需要采取的防护措施。
                    </p>

                    <h4>如何使用AQI信息</h4>
                    <p>
                        公众可以根据AQI值及相应的健康提示，合理安排户外活动，做好个人防护。特别是老人、儿童和患有心脏病、肺病等疾病的人群，应更加注意空气质量状况。
                    </p>

                    <h4>提交反馈时的AQI估计</h4>
                    <p>
                        在提交环保反馈时，您可以根据自己的感受和观察，对当地的空气质量进行估计。这有助于环保部门更好地了解实际情况，及时采取措施。
                    </p>
                </div>
            </el-card>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AppLayout from '../components/AppLayout.vue'
import { getAQIList } from '../api/common'

const router = useRouter()
const loading = ref(false)
const aqiList = ref<any[]>([])

// 获取AQI列表
const loadAQIList = async () => {
    loading.value = true
    try {
        const res = await getAQIList()
        aqiList.value = res.data || []

        // 按AQI ID排序
        aqiList.value.sort((a, b) => a.aqi_id - b.aqi_id)
    } catch (error) {
        console.error('获取AQI列表失败:', error)
        ElMessage.error('获取AQI数据失败，请稍后重试')
    } finally {
        loading.value = false
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
        loadAQIList()
    }
})
</script>

<style scoped>
.aqi-info-container {
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    margin-bottom: 20px;
    color: #303133;
}

.aqi-info-card {
    margin-bottom: 20px;
}

.card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
}

.aqi-level {
    display: flex;
    align-items: center;
}

.aqi-color {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 8px;
}

.empty-data {
    padding: 30px 0;
    text-align: center;
}

.aqi-explanation {
    color: #606266;
    line-height: 1.6;
}

.aqi-explanation h4 {
    margin: 20px 0 10px;
    color: #303133;
}

.aqi-explanation p {
    margin: 10px 0;
}

.mt-20 {
    margin-top: 20px;
}
</style>
