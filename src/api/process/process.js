import request from '@/utils/request.js'


export const processService = (data) => {
    const params = new URLSearchParams();
    for (let key in data){
        params.append(key,data[key])
    }
    return request.get('/admin/process/findByProcess',{params:data});
}

export const updateStatusService = (id) => {
    const url = '/admin/process/updateStatus/' + id
    return request.put(url)
}

export const processUpdateService = (json) => {
    return request.patch('/admin/process/update',json,{headers:{'Content-Type': 'application/json'}})
}