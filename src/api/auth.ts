import request from '../utils/request'

// 监督员登录
export function login(data: { tel_id: string; password: string }) {
    return request({
        url: '/auth/supervisor/login',
        method: 'post',
        data,
    })
}

// 获取当前登录用户信息
export function getUserInfo() {
    return request({
        url: '/supervisor/info',
        method: 'get',
    })
}

// 监督员注册
export function register(data: { tel_id: string; password: string; real_name: string }) {
    return request({
        url: '/auth/supervisor/register',
        method: 'post',
        data,
    })
}

// 删除自己的账户
export function deleteSelf() {
    return request({
        url: '/supervisor/delete',
        method: 'delete',
    })
}
