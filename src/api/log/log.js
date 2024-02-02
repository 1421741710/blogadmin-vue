import request from '@/utils/request.js'


export const logService = (data) => {
    const params = new URLSearchParams();
    for (let key in data){
        params.append(key,data[key])
    }
    return request.get('/admin/log/findByLogPage',{params:data});
}