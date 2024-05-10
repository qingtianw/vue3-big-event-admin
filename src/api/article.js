import request from '@/utils/request'
// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
// 添加文章分类
export const artAddChannelsService = (data) => {
  return request.post('/my/cate/add', data)
}
// export const artAddChannelsService = (data) =>  request.post('/my/cate/add',data)
// 编辑文章分类
export const artEditChannelsService = (data) => {
  return request.put('/my/cate/info', data)
}

// 删除文章分类
export const artDelChannelsService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 文章

// 文章：获取文章列表
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })

// 文章：添加文章
// 注意：data需要是一个formData格式的对象
export const artPublishService = (data) => request.post('/my/article/add', data)
// 文章:获取文章详情
export const artGetDetailService = (id) =>
  request.get('my/article/info', { params: { id } })
// 文章:编辑文章接口
export const artEditService = (data) => request.put('my/article/info', data)
// 封装删除接口
export const artDelService = (id) =>
  request.delete('my/article/info', { params: { id } })

// 更新用户信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

// 上传头像更新用户头像
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更新密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
