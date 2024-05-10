<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
// defineProps接收父组件传来的值，defineEmits接收父组件传来的方法
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(res.data.data)
}
getChannelList()
</script>
<template>
  <!-- label展示给用户看的，value收集起来提交给后台的 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
    style="width: 150px"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
