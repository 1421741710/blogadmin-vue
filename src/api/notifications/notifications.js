import request from '@/utils/request.js'


export const notificationsService = (data) => {
    const params = new URLSearchParams();
    for (let key in data){
        params.append(key,data[key])
    }
    return request.get('/admin/notifications/findBynotifications',{params:data});
}

export const deleteNotificationsSerivce = (id) => {
    const url = '/admin/notifications/' + id
    return request.delete(url)
}

export const notificationsUpdateService = (json) => {
    return request.patch('/admin/notifications/update',json,{headers:{'Content-Type': 'application/json'}})
}

export const notificationsInsertService = (json) => {
    return request.post('/admin/notifications/insert',json,{headers:{'Content-Type': 'application/json'}})
}