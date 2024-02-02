import request from '@/utils/request.js'

export const uploadService = (file) => {
    const formData = new FormData();
    formData.append('file',file)
    return request.post('/admin/common/upload',formData,{headers:{'Content-Type': 'multipart/form-data'}})
}