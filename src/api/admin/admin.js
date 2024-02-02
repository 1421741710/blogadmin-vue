import request from '@/utils/request.js'


export const adminLoginService = (loginData) =>{
    const params = new URLSearchParams();
    for (let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/admin/login',loginData);
}

export const adminListService = (data) => {
    const params = new URLSearchParams();
    for (let key in data){
        params.append(key,data[key])
    }
    return request.get('/admin/findByAdminPageQuery',{params:data});
}

export const updateAdminPwdService = (json) => {
    return request.patch('/admin/updateAdminPwd',json,{headers:{'Content-Type': 'application/json'}})
}

export const updateStatusService = (id) => {
    const url = '/admin/updateStatus/' + id
    return request.put(url)
}

export const insertAdminService = (json) => {
    return request.post('/admin/insert',json,{headers:{'Content-Type': 'application/json'}})
}

export const updateRoleService = (id) => {
    const url = '/admin/updateRole/' + id
    return request.put(url)
}