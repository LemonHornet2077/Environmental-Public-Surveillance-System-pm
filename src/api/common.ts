import request from '../utils/request'

// 获取所有省份列表
export function getProvinces() {
    return request({
        url: '/public/location/provinces',
        method: 'get',
    })
}

// 获取指定省份的城市列表
export function getCities(provinceId: number) {
    return request({
        url: `/public/location/cities/${provinceId}`,
        method: 'get',
    })
}

// 获取空气质量指数级别数据
export function getAQIList() {
    return request({
        url: '/public/aqi/list',
        method: 'get',
    })
}
