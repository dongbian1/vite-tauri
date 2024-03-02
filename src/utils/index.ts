/**
 * 随机生成数值
 * @param min 最小值
 * @param max 最大值
 */
export const getRandomInitInclusive = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
