import request from '@/utils/request.js'

export const userPageQueryService = (data) => {
    return request.get('/admin/user/findByUser',{params:data})
}

export const updateStatusService = (id) => {
    const url = '/admin/user/update/'+id
    return request.put(url)
}

export const userUpdateService = (json) => {
    return request.patch('/admin/user/update',json,{headers:{'Content-Type': 'application/json'}})
}