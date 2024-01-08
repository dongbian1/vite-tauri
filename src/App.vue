<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmojiWaterfall from './components/EmojiWaterfall.vue'
import Barrage from './components/Barrage.vue'
import ScrollSeamless from './components/ScrollSeamless.vue'

type ComponentType = 'emoji' | 'barrage' | 'scroll'

const msg = ref<string[]>(['今天你EMO了吗'])

const isComponent = ref<ComponentType>('scroll')

onMounted(() => {
  document.onkeydown = (event) => {
    const key = event.key
    if (key === 's') {
      const title = prompt('输入你想要title吧？',)
      msg.value = (title ?? '').split(',')
    } else if (key === 'p') {
      const componentArr: Array<ComponentType> = ['emoji','barrage', 'scroll']
      const index = componentArr.indexOf(isComponent.value)
      if(index === componentArr.length - 1) {
        isComponent.value = componentArr[0]
      } else {
        isComponent.value = componentArr[index + 1]
      }
    }
  }
})
</script>

<template>
  <component :is="{ emoji: EmojiWaterfall, barrage: Barrage, scroll: ScrollSeamless }[isComponent]" :msg="msg" />
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
