<template>
    <AppLayout>
        <div class="submit-feedback-container">
            <h2 class="page-title">提交环保反馈</h2>

            <el-card class="feedback-form-card">
                <el-form
                    :model="feedbackForm"
                    :rules="feedbackRules"
                    ref="feedbackFormRef"
                    label-position="top"
                    label-width="120px"
                >
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="省份" prop="province_id">
                                <el-select
                                    v-model="feedbackForm.province_id"
                                    placeholder="请选择省份"
                                    class="full-width"
                                    @change="handleProvinceChange"
                                >
                                    <el-option
                                        v-for="item in provinceList"
                                        :key="item.province_id"
                                        :label="item.province_name"
                                        :value="item.province_id"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="城市" prop="city_id">
                                <el-select
                                    v-model="feedbackForm.city_id"
                                    placeholder="请选择城市"
                                    class="full-width"
                                    :disabled="!feedbackForm.province_id"
                                >
                                    <el-option
                                        v-for="item in cityList"
                                        :key="item.city_id"
                                        :label="item.city_name"
                                        :value="item.city_id"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="详细地址" prop="address">
                        <el-input
                            v-model="feedbackForm.address"
                            placeholder="请输入详细地址，如街道、小区、门牌号等"
                        />
                    </el-form-item>

                    <el-form-item label="反馈信息" prop="information">
                        <el-input
                            v-model="feedbackForm.information"
                            type="textarea"
                            :rows="4"
                            placeholder="请详细描述您发现的环保问题"
                        />
                    </el-form-item>

                    <el-form-item label="预估空气质量等级" prop="estimated_grade">
                        <el-select
                            v-model="feedbackForm.estimated_grade"
                            placeholder="请选择您预估的空气质量等级"
                            class="full-width"
                        >
                            <el-option
                                v-for="item in aqiList"
                                :key="item.aqi_id"
                                :label="`${item.chinese_explain} - ${item.aqi_explain}`"
                                :value="item.aqi_id"
                            >
                                <div class="aqi-option">
                                    <span
                                        class="aqi-color"
                                        :style="{ backgroundColor: item.color }"
                                    ></span>
                                    <span>{{ item.chinese_explain }} - {{ item.aqi_explain }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" :loading="submitting" @click="submitFeedback"
                            >提交反馈</el-button
                        >
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>

            <el-card class="aqi-info-card mt-20" v-if="selectedAQI">
                <template #header>
                    <div class="card-header">
                        <h3>选中的空气质量等级信息</h3>
                    </div>
                </template>
                <div class="aqi-info">
                    <div class="aqi-header" :style="{ backgroundColor: selectedAQI.color }">
                        <h4>{{ selectedAQI.chinese_explain }} - {{ selectedAQI.aqi_explain }}</h4>
                    </div>
                    <div class="aqi-details">
                        <p><strong>健康影响：</strong>{{ selectedAQI.health_impact }}</p>
                        <p><strong>建议措施：</strong>{{ selectedAQI.take_steps }}</p>
                    </div>
                </div>
            </el-card>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import AppLayout from '../components/AppLayout.vue'
import { getProvinces, getCities, getAQIList } from '../api/common'
import { submitFeedback as submitFeedbackApi } from '../api/feedback'

const router = useRouter()
const feedbackFormRef = ref<FormInstance>()
const submitting = ref(false)

// 省份和城市列表
const provinceList = ref<any[]>([])
const cityList = ref<any[]>([])
const aqiList = ref<any[]>([])

// 表单数据
const feedbackForm = reactive({
    province_id: null as number | null,
    city_id: null as number | null,
    address: '',
    information: '',
    estimated_grade: null as number | null,
})

// 表单验证规则
const feedbackRules = reactive<FormRules>({
    province_id: [{ required: true, message: '请选择省份', trigger: 'change' }],
    city_id: [{ required: true, message: '请选择城市', trigger: 'change' }],
    address: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
        { min: 5, max: 200, message: '地址长度应在5到200个字符之间', trigger: 'blur' },
    ],
    information: [
        { required: true, message: '请输入反馈信息', trigger: 'blur' },
        { min: 10, max: 400, message: '反馈信息长度应在10到400个字符之间', trigger: 'blur' },
    ],
    estimated_grade: [{ required: true, message: '请选择预估空气质量等级', trigger: 'change' }],
})

// 选中的AQI信息
const selectedAQI = computed(() => {
    if (!feedbackForm.estimated_grade) return null
    return aqiList.value.find((item) => item.aqi_id === feedbackForm.estimated_grade)
})

// 获取省份列表
const loadProvinces = async () => {
    try {
        const res = await getProvinces()
        provinceList.value = res.data || []
    } catch (error) {
        console.error('获取省份列表失败:', error)
    }
}

// 获取城市列表
const loadCities = async (provinceId: number) => {
    try {
        const res = await getCities(provinceId)
        cityList.value = res.data || []
    } catch (error) {
        console.error('获取城市列表失败:', error)
    }
}

// 获取AQI列表
const loadAQIList = async () => {
    try {
        const res = await getAQIList()
        aqiList.value = res.data || []
    } catch (error) {
        console.error('获取AQI列表失败:', error)
    }
}

// 处理省份变化
const handleProvinceChange = (value: number) => {
    feedbackForm.city_id = null
    if (value) {
        loadCities(value)
    } else {
        cityList.value = []
    }
}

// 提交反馈
const submitFeedback = async () => {
    if (!feedbackFormRef.value) return

    await feedbackFormRef.value.validate(async (valid) => {
        if (valid) {
            // 确保所有必填字段都有值
            if (
                feedbackForm.province_id === null ||
                feedbackForm.city_id === null ||
                feedbackForm.estimated_grade === null
            ) {
                ElMessage({
                    type: 'error',
                    message: '请填写所有必填字段',
                })
                return
            }

            submitting.value = true
            try {
                // 创建一个新对象，确保类型匹配
                const submitData = {
                    province_id: feedbackForm.province_id as number,
                    city_id: feedbackForm.city_id as number,
                    address: feedbackForm.address,
                    information: feedbackForm.information,
                    estimated_grade: feedbackForm.estimated_grade as number,
                }

                const res = await submitFeedbackApi(submitData)

                ElMessage({
                    type: 'success',
                    message: '反馈提交成功',
                })

                // 重置表单
                resetForm()

                // 跳转到反馈列表页
                router.push('/feedback')
            } catch (error) {
                console.error('提交反馈失败:', error)
            } finally {
                submitting.value = false
            }
        }
    })
}

// 重置表单
const resetForm = () => {
    if (feedbackFormRef.value) {
        feedbackFormRef.value.resetFields()
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
onMounted(async () => {
    if (!checkLogin()) return

    await loadProvinces()
    await loadAQIList()
})
</script>

<style scoped>
.submit-feedback-container {
    max-width: 900px;
    margin: 0 auto;
}

.page-title {
    margin-bottom: 20px;
    color: #303133;
}

.feedback-form-card {
    margin-bottom: 20px;
}

.aqi-option {
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

.aqi-info-card {
    margin-top: 20px;
}

.aqi-header {
    padding: 15px;
    border-radius: 4px;
    color: white;
    margin-bottom: 15px;
}

.aqi-header h4 {
    margin: 0;
    font-size: 18px;
}

.aqi-details {
    padding: 0 15px;
}

.aqi-details p {
    margin: 10px 0;
    line-height: 1.6;
}
</style>
