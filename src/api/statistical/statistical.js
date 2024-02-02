import request from '@/utils/request.js'


export const statisticalService = () => {
    return request.get('/admin/statistical /findByStatistical')
}