<template>
  <div ref="wrapper" class="w-full h-full bg-red flex flex-col items-center">
    <video ref="videoEl" />
  </div>
  <canvas class="canvas" ref="canvasEl"
    :style="{ visibility: isCode ? 'hidden' : 'visible', width: '300px', height: '300px' }"></canvas>
  <div v-if="!isCode">
    <div>{{ codeValue }}</div>
    <button @click="afreshQr">重新扫码</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import jsQR from 'jsqr'

defineOptions({
  name: 'QrCode'
})

const wrapper = ref<HTMLDivElement>();
const videoEl = ref<HTMLVideoElement>();
const canvasEl = ref()
const frameNumber = ref<number>(0)
const isCode = ref<boolean>(true)
const codeValue = ref<string>('')

const afreshQr = () => {
  if (!videoEl.value) return
  isCode.value = true
  videoEl.value.style.display = 'block'
  checkCamera();
}

const checkCamera = async () => {
  const navigator = window.navigator.mediaDevices;
  const devices = await navigator.enumerateDevices();
  if (devices) {
    const stream = await navigator.getUserMedia({
      audio: false,
      video: {
        width: 300,
        height: 300,
        facingMode: { exact: "environment" }, //强制后置摄像头
        // facingMode: "user", //前置摄像头
      },
    });
    if (!videoEl.value) return;

    videoEl.value.srcObject = stream;
    videoEl.value.setAttribute("playsinline", 'true');
    videoEl.value.setAttribute("webkit-playsinline", 'true');
    videoEl.value.addEventListener("loadedmetadata", () => {
      if (!videoEl.value) return
      videoEl.value.play();
      sweep();
    });
  }
}

const sweep = () => {
  if (!videoEl.value) return
  if (!canvasEl.value) return
  if (!isCode.value) return
  const { videoWidth, videoHeight } = videoEl.value;
  const ctx = canvasEl.value.getContext('2d')
  ctx?.drawImage(videoEl.value, 0, 0, videoWidth, videoHeight);
  const img = ctx.getImageData(0, 0, videoWidth, videoHeight);
  const obj = jsQR(img.data, img.width, img.height, {
    inversionAttempts: "dontInvert",
  });
  if (obj) {
    isCode.value = false
    videoEl.value.style.display = 'none'
    codeValue.value = obj.data
    cancelAnimationFrame(frameNumber.value)
  }
  frameNumber.value = requestAnimationFrame(() => {
    sweep();
  });
}

onMounted(() => {
  checkCamera();
});
</script>
