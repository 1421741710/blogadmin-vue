import request from '@/utils/request.js'

export const userInfoPageQueryService = (data) => {
    return request.get('/admin/userinfo/findByUserInfo',{params:data})
}