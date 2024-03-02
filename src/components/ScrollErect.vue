<template>
	<div class="master">
		<div v-for="(item, index) in options.content" :key="index" class="box">
			<div class="one">
				<div v-for="(cItem, cIndex) in item" :key="`${index}-${cIndex}`">{{ cItem }}</div>
			</div>
		</div>
	</div>
	<!-- <div>中奖: {{ options.content[0][stopPosition[0]] }}{{ options.content[1][stopPosition[1]] }}{{ options.content[2][stopPosition[2]] }}</div> -->
	<button v-if="!isStart" class="btn" @click="onStart()">开 始</button>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import JSConfetti from 'js-confetti';

interface OptionsProps {
	boxHeight: number;
	speed: number[];
	timer: Array<NodeJS.Timer | null>;
	imgsBox: HTMLCollectionOf<Element> | null;
	content: Array<string[]>;
}

defineOptions({
	name: 'ScrollErect',
});

const options = reactive<OptionsProps>({
	boxHeight: 200,
	speed: [20, 20, 20],
	timer: [null],
	imgsBox: null,
	content: [
		['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
		['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
		['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
	],
});

const isStart = ref<boolean>(false);

const stopPosition = ref<number[]>([]);
const stopInterval = ref<NodeJS.Timer[]>([]);

onMounted(() => {
	init();
});

const init = () => {
	options.imgsBox = document.getElementsByClassName('one');
	addImg();
};

const onStart = () => {
	if (!options.imgsBox) return;
	isStart.value = true;
	options.speed = [20, 20, 20];
	onRun();
	for (let i = 0; i < options.imgsBox.length; i++) {
		const top = getRandomInitInclusive(-(options.content[i].length - 1) * 100, -100);
		// @ts-ignore
		options.imgsBox[i].style.top = top + 'px';
		stopPosition.value[i] = getRandomInitInclusive(0, options.content[i].length - 1);
	}
	setTimeout(() => {
		onEnd(0);
	}, 3000);
};

const onEnd = (index: number) => {
	stopInterval.value[index] = setInterval(() => {
		if (options.speed[index] === 1) return clearInterval(stopInterval.value[index]);
		// @ts-ignore
		const top = parseInt(options.imgsBox[index].style.top);
		if (options.speed[index] === 5) {
			if (Math.ceil(top / 100) * 100 === stopPosition.value[index] * -200) {
				clearInterval(stopInterval.value[index]);
				stopInterval.value[index] = setInterval(() => {
					options.speed[index] = options.speed[index] - 1;
					if (options.speed[index] === 1) return clearInterval(stopInterval.value[index]);
				}, 100);
			} else {
				options.speed[index] = 6;
			}
		}
		options.speed[index] = options.speed[index] - 1;
	}, 200);
};

const addImg = () => {
	if (!options.imgsBox) return;
	for (let i = 0; i < options.imgsBox.length; i++) {
		const firstImg = options.imgsBox[i].children[0].cloneNode(true);

		const lastImg = options.imgsBox[i].children[options.imgsBox[i].children.length - 1].cloneNode(true);
		// 将图片插入图片容器最前面和最后面
		options.imgsBox[i].insertBefore(lastImg, options.imgsBox[i].children[0]);
		options.imgsBox[i].appendChild(firstImg);
		// 矫正图片位置
		// @ts-ignore
		options.imgsBox[i].style.top = -options.boxHeight + 'px';
	}
};

const onRun = () => {
	if (!options.imgsBox) return;
	for (let i = 0; i < options.imgsBox.length; i++) {
		// @ts-ignore
		clearInterval(options.timer[i]);
		options.timer[i] = setInterval(() => {
			// @ts-ignore
			let l = options.imgsBox[i].style.top;
			const height = parseInt(l) - options.speed[i];
			if (options.speed[i] === 1) {
				const stopTop = -((stopPosition.value[i] + 1) * 200);
				if (height === stopTop) {
					// @ts-ignore
					clearInterval(options.timer[i]);
					clearInterval(stopInterval.value[i]);
					// @ts-ignore
					if (i < options.imgsBox.length - 1) {
						onEnd(i + 1);
					}
					if (i === 2) {
						const interval = setInterval(() => {
							burstColor();
						}, 1000);
						setTimeout(() => {
							clearInterval(interval);
							isStart.value = false;
						}, 3000);
					}
				}
			}
			if (height < -200 * 6) {
				// @ts-ignore
				options.imgsBox[i].style.top = '0px';
			} else {
				// @ts-ignore
				options.imgsBox[i].style.top = `${height}px`;
			}
		}, 10);
	}
};

const jsConfetti = new JSConfetti();

const burstColor = () => {
	jsConfetti.addConfetti({
		emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
		emojiSize: 20,
	});
};

/**
 * 随机生成数值
 * @param min 最小值
 * @param max 最大值
 */
const getRandomInitInclusive = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
</script>

<style scoped lang="scss">
.master {
	display: flex;
}

.box {
	width: 200px;
	height: 200px;
	overflow: hidden;
}

.one {
	width: 200px;
	height: 200px;
	position: relative;

	div {
		width: 200px;
		height: 200px;
		color: #333;
		font-size: 100px;
		text-align: center;
		line-height: 200px;
	}
}
</style>
