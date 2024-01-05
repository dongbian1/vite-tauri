<template>
  <div class="box">
    <div class="box_btnBox">
      <button class="leftBtn" @click="butClick('direction','left')">向左</button>
      <button class="rightBtn" @click="butClick('direction','right')">向右</button>
      <button class="stopBtn" @click="butClick('stop','')">暂停</button>
      <button class="addSpeedBtn" @click="butClick('speed', options.speed + 1)">加速</button>
      <button class="subSpeedBtn" @click="butClick('speed', options.speed - 1)">减速</button>
      <button class="restoreBtn" @click="butClick('speed', 5)">速度还原</button>
    </div>
    <div class="box_imgBox">
      <div class="imgsBox">
        <img src="../assets/images/狗.jpg" alt="">
        <img src="../assets/images/机器猫.jpg" alt="">
        <img src="../assets/images/猫.jpg" alt="">
        <img src="../assets/images/王思聪.jpg" alt="">
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';

interface OptionsProps {
  imgWidth: number
  speed: number
  direction: 'right' | 'left'
  timer: NodeJS.Timer | null
  imgsBox: Element | null
}

defineOptions({
  name: 'ScrollSeamless'
})

const options = reactive<OptionsProps>({
  imgWidth: 500,
  speed: 1,
  direction: 'right',
  timer: null,
  imgsBox: null
})

onMounted(() => {
  init()
})

const init = () => {
  options.imgsBox = document.querySelector('.imgsBox')
  addImg()
  // 矫正图片位置
  // @ts-ignore
  options.imgsBox.style.left = -options.imgWidth + 'px'
  imgRun()
}

const addImg = () => {
  if (!options.imgsBox) return
  const firstImg = options.imgsBox.children[0].cloneNode(true)
  
  const lastImg = options.imgsBox.children[options.imgsBox.children.length - 1].cloneNode(true)
  // 将图片插入图片容器最前面和最后面
  options.imgsBox.insertBefore(lastImg, options.imgsBox.children[0])
  options.imgsBox.appendChild(firstImg)
}

const imgRun = () => {
  clearInterval(options.timer)
  if (!options.imgsBox) return
  options.timer = setInterval(() => {
    //  获取当前left
    let l = options.imgsBox.offsetLeft
    if (options.direction === 'right') l += options.speed
    else l -= options.speed
    // 判断是否到第一张或最后一张
    if (l <= -(options.imgsBox.children.length - 1) * options.imgWidth) {
      options.imgsBox.style.left = -options.imgWidth + 'px'
      return
    } else {
      options.imgsBox.style.left = l + 'px'
    }
    if (l >= 0) {
      options.imgsBox.style.left = -(options.imgsBox.children.length - 2) * options.imgWidth + 'px'
      return
    } else {
      options.imgsBox.style.left = l + 'px'
    }
  }, 1)
}

const butClick = (type: string, value: string | number) => {
  if (type === 'direction') {
    options.direction = value === 'left' ? 'left' : 'right'
    imgRun()
  } else if (type === 'speed') {
    options.speed = value as number
  } else if (type === 'stop') {
    clearInterval(options.timer)
  }
}

</script>
<style scoped lang="scss">
.box_btnBox {
  width: 520px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box_btnBox button {
  padding: 5px 20px;
}

.box .imgsBox img {
  width: 500px;
  height: 280px;
}

.box_imgBox {
  width: 500px;
  height: 280px;
  border: 10px solid red;
  overflow: hidden;
  position: relative;
}

.imgsBox {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
}
/* 
:deep(.imgsBox) {
  animation: imgsBoxInner 5s linear;
  animation-iteration-count: infinite;
}
@keyframes imgsBoxInner{
  0% {
    left: -2000px;
  }
 
  100% {
    left: 0px;
  }
} */
</style>