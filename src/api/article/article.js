import request from '@/utils/request.js'

export const articleListService = (data) => {
    return request.get('/admin/article/findByArticle',{params:data})
}

export const articleDeleteService = (id) => {
    const url = '/admin/article/'+id
    return request.delete(url)
}

export const articleUpdateService = (json) => {
    return request.patch('/admin/article/update',json,{headers:{'Content-Type': 'application/json'}})
}

export const articleInsertService = (json) => {
    return request.post('/admin/article/insert',json,{headers:{'Content-Type': 'application/json'}})
}