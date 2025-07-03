import request from '../utils/request'

// 提交反馈
export function submitFeedback(data: {
    province_id: number
    city_id: number
    address: string
    information: string
    estimated_grade: number
}) {
    return request({
        url: '/supervisor/feedback/submit',
        method: 'post',
        data,
    })
}

// 获取自己的反馈列表
export function getFeedbackList() {
    return request({
        url: '/supervisor/feedback/list',
        method: 'get',
    })
}
