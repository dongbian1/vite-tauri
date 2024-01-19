<template>
  <div class="grid-content" ref="gridContent" :style="gridStyle" @scroll="getMoreData">
    <grid-item v-for="item in showDataList" :key="item.dataIndex" :data="item" :linePx="linePx">
      <template #slot-scope="slotProps">
        <slot name="slot-scope" :slotProps="slotProps"></slot>
      </template>
    </grid-item>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import GridItem from './GridItem.vue'

interface GridProps {
  // 瀑布流列表数据
  dataList: any[]
  // 展示的列数
  columns?: number
  // 宽度
  width?: number
  // 高度
  height?: number
  // 行距
  linePx?: number
  // 间距
  space?: number
  // 滚动到底部触发加载数据的距离
  trigger?: number
  // 加载
  loading: boolean
}

const props = withDefaults(defineProps<GridProps>(), {
  dataList: () => [],
  columns: 2,
  width: 300,
  height: 400,
  linePx: 0,
  space: 0,
  trigger: 50,
  loading: true
})

const emit = defineEmits(['getMoreData']);

const gridStyle = ref({});
const showDataList = ref<any>([])

watch(() => props.dataList, (newValue) => {
  let tempData: any = [];
  newValue.forEach((item: any, index) => {
    tempData.push({ ...item, dataIndex: index })
  })
  showDataList.value = tempData;

  gridStyle.value = {
    'grid-template-columns': `repeat(${props.columns}, 1fr)`,
    'grid-column-gap': `${props.space}px`,
    width: props.width + 'px',
    height: props.height + 'px',
  }
}, { immediate: true, deep: true })

const isLoading = ref<boolean>(false);

watch(() => props.loading, (newValue: boolean) => {
  isLoading.value = newValue;
})

const gridContent = ref<any>(null);
//根据触底数据判断获取最新数据
const getMoreData = () => {
  const scrollHeight = gridContent.value.scrollHeight || 0;
  const clientHeight = gridContent.value.clientHeight || 0;
  const scrollTop = gridContent.value.scrollTop || 0;
  if (scrollHeight - clientHeight - scrollTop < props.trigger && !isLoading.value) {
    isLoading.value = true;
    emit('getMoreData');
  }
}

</script>
<style scoped lang="scss">
.grid-content {
  display: grid;
  grid-auto-rows: minmax(1px, 1px);
  overflow: auto;
}
</style>