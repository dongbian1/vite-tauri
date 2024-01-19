<template>
  <div class="grid-item" :style="itemStyle">
    <div ref="gridItem">
      <slot name="slot-scope" :data="data"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const props = defineProps<{ data: any, linePx: number }>()

const gridItem = ref<any>(null);
const itemStyle = ref({})

onMounted(() => {
  let endNumber = gridItem.value.clientHeight - 1
  endNumber += props.linePx
  itemStyle.value = { 'grid-row-end': `span ${endNumber}` }
})

</script>
<style scoped>
.grid-item {
  grid-row-end: span 100;
}
</style>