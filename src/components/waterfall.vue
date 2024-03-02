<template>
	<div class="content">
		<GridContent
			:data-list="dataList"
			:columns="columns"
			:width="windowWidth"
			:height="windowHeight"
			:loading="isLoading"
			:line-px="10"
			:space="10"
			@get-more-data="getMoreData"
		>
			<template #slot-scope="{ slotProps }">
				<div class="item" :style="{ background: slotProps.data.color }">
					<img :style="{ height: `${slotProps.data.height - 48}px` }" :src="slotProps.data.img" alt="" />
					<div class="title">不知道搞什么</div>
					<div class="info">
						<div class="name">XXXX</div>
						<div class="number">1234</div>
					</div>
				</div>
			</template>
		</GridContent>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GridContent from './waterfall/GridContent.vue';
import { getRandomInitInclusive } from '@/utils/index';

const isLoading = ref(true);
const dataList = ref<any>([]);
const columns = ref<number>(2);

// 屏幕宽度
const windowWidth = ref<number>(0);
// 屏幕高度
const windowHeight = ref<number>(0);

const getMoreData = () => {
	isLoading.value = true;
	getData();
};

//获取数据
const getData = async () => {
	for (let i = 0; i < 10; i++) {
		const imgArr = [
			'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2022%2F0415%2F686fb5a6j00raca2v002zc000hs00qnc.jpg&thumbnail=660x2147483647&quality=80&type=jpg',
			'https://img1.baidu.com/it/u=1300823040,1107837353&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889',
			'https://img0.baidu.com/it/u=1275095085,1961143463&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
			'https://img1.baidu.com/it/u=2547469227,2086905621&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
		];
		const imgIndex = getRandomInitInclusive(0, imgArr.length - 1);
		const img = imgArr[imgIndex];
		const res = await preLoadImage(img);
		const imgW = (windowWidth.value - 10 * (columns.value - 1)) / columns.value;
		const imgScale = Math.floor((res.width / imgW) * 100) / 100;
		const imgH = Math.floor((res.height / imgScale) * 100) / 100;
		dataList.value.push({ height: imgH + 48, img: img });
	}
	setTimeout(() => {
		isLoading.value = false;
	});
};

const preLoadImage = (link: string) => {
	return new Promise<{ width: number; height: number }>((resolve, reject) => {
		const img = new Image();
		img.src = link;
		img.onload = () => {
			// load 事件代表图片已经加载完毕，通过该回调才访问到图片真正的尺寸信息
			resolve({ width: img.width, height: img.height });
		};
		img.onerror = (err) => {
			reject(err);
		};
	});
};

onMounted(() => {
	getData();
	getWindowResize();
	window.addEventListener('resize', getWindowResize);
});

// 获取屏幕尺寸
const getWindowResize = () => {
	windowWidth.value = window.innerWidth - 20.5;
	windowHeight.value = window.innerHeight;
};
</script>
<style scoped lang="scss">
.content {
	padding: 0px 10px;
	background: #efefef;
}
.item {
	background: #fff;
}

.title {
	color: #333;
	font-size: 16px;
	text-align: left;
	font-weight: bold;
}
.info {
	display: flex;
	justify-content: space-around;
	font-size: 12px;
	.name {
		width: 50%;
		text-align: start;
	}
	.number {
		width: 50%;
	}
}
</style>
