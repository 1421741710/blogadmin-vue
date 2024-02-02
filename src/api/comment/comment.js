import request from '@/utils/request.js'

export const commentService = (data) => {
    const params = new URLSearchParams();
    for (let key in data){
        params.append(key,data[key])
    }
    return request.get('/admin/comment/findByComment',{params:data});
}


export const commentDeleteService = (id) => {
    const url = '/admin/comment/delete/'+id
    return request.get(url)
}