<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
const articleList = ref([]) //文章列表
const total = ref(0) //总条数
const loading = ref(false) //loading状态
// 定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
// 基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 处理分页逻辑
const onSizeChange = (size) => {
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页和每页条数，渲染数据
  getArticleList()
}
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页，渲染数据
  getArticleList()
}
// 搜索逻辑=>按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 //重置页码
  getArticleList()
}
// 重置逻辑=>将涮选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1 //重置页码
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 删除逻辑
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}
// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pageSize)
    // 更新成最大页码数，再渲染
    params.value.pagenum = lastPage
    getArticleList()
  } else {
    // 如果是编辑，直接渲染当前页即可
    getArticleList()
  }
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布/草稿 -->
        <el-select v-model="params.state" style="width: 150px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column aria-label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column aria-label="分类" prop="cate_name"></el-table-column>
      <el-table-column aria-label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column aria-label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据   -->
      <el-table-column aria-label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 抽屉 -->
    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>
<style lang="scss" scoped></style>
