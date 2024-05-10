<script setup>
import { artDelChannelsService, artGetChannelsService } from '@/api/article'
import PageContainer from '@/components/PageContainer.vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { Delete } from '@element-plus/icons-vue'
import { Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // channelList.value = []
  loading.value = false
  // console.log(channelList.value)
}

getChannelList()

const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确定要删除该分类吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannelsService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column
        aria-label="序号"
        type="index"
        width="100"
      ></el-table-column>
      <el-table-column prop="cate_name" aria-label="分类名称"></el-table-column>
      <el-table-column
        prop="cate_alias"
        aria-label="分类别名"
      ></el-table-column>
      <el-table-column aria-label="操作" width="150">
        <!-- row是channelList的每一项 $index下标 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>
<style lang="scss" scoped></style>
