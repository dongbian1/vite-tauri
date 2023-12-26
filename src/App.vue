<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmojiWaterfall from './components/EmojiWaterfall.vue'
// import Barrage from './components/Barrage.vue'

const msg = ref<string[]>(['今天你EMO了吗'])

onMounted(() => {
  document.onkeydown = (event) => {
    console.log(event)
    const key = event.key
    if (key === 's') {
      const title = prompt('输入你想要title吧？',)
      msg.value = (title ?? '').split(',')
    }
  }
})
</script>

<template>
  <EmojiWaterfall :msg="msg" />
  <!-- <Barrage msg="弹幕"/> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
