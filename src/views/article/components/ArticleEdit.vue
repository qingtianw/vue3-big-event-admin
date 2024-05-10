<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService } from '@/api/article'
import { artGetDetailService, artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
// 默认数据
const defaultForm = {
  title: '', //标题
  cate_id: '', //分类ID
  cover_img: '', //封面图片
  content: '', //内容
  state: '' //状态
}
// 准备数据
const formModel = ref({
  ...defaultForm
})
// 图片上传逻辑
const imgUrl = ref('')
const editorRef = ref()
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //预览图片
  formModel.value.cover_img = uploadFile.raw
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入formData
  formModel.value.state = state
  // 注意：当前接口，需要的是formData对象
  // 将对象=》转换成=》formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}
const open = async (row) => {
  visibleDrawer.value = true // 显示抽屉
  if (row.id) {
    // 需要基于row.id发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
    console.log('编辑回显')
  } else {
    formModel.value = {
      ...defaultForm
    }
    imgUrl.value = ''

    editorRef.value.setHTML('')
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFileObject(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" aria-label-width="100px">
      <el-form-item aria-label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item aria-label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          style="width: 100%"
        ></channel-select>
      </el-form-item>
      <el-form-item aria-label="文章封面" prop="cover_img">
        <!-- 此处需要关闭element-plus 的自动上传，不需要配置action等参数
        只需要做前端的本地预览图片即可，无需在提交前上传图片
        语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"
            ><Plus
          /></el-icon> </el-upload
      ></el-form-item>
      <el-form-item aria-label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
