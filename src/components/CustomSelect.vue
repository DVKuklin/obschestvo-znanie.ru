<template>
	<div class="select-container">
		<div class="selected" @click="isOpened = !isOpened" :style="{width: width + 'rem'}">
			{{ name ? name : placeHolder }}
			<img src="/myfiles/button_drop_down.svg" class="button_drop_down">
		</div>
		<div v-if="isOpened" class="options-container" :style="{width: (width + 0.4) + 'rem'}">
			<div v-for="(option, i) in options" :key="i" @click="change(option.value)" class="item">
				{{ option.name }}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CustomSelect',
		props: [
			'modelValue',
			'options',
			'placeHolder',
			'width'
		],
		data(){
			return {
				name: '',
				isOpened: false,
			}
		},
		methods:{
			change(value) {
				this.$emit('update:modelValue', value);
				this.isOpened = false;
			},
			getName() {
				let name = '';
				this.options.forEach((item) => {
					if (item.value == modelValue) {
						name = item.name;
					}
				})
				return name;
			},
			setName() {
				this.name = '';
				this.options.forEach((item) => {
					if (item.value == this.modelValue) {
						this.name = item.name;
					}
				});
			}
		},
		mounted() {
			this.setName();
		},
		watch: {
			modelValue: function() {
				this.setName();
				this.$emit('change');
			}
		}
	}
</script>

<style lang="less" scoped>
	.select-container {
		position: relative;
		cursor:pointer;	
	}
	.selected {
		padding: 0.1rem 0.2rem;
		background-color: rgba(96,93,207,0.46);
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 10rem;
	}
	.options-container {
		padding: 0 0 0.1rem;
		display:flex;
		flex-direction: column;
		position: absolute;
		z-index: 3;
		overflow:hidden;
		background-color: rgba(96,93,207,1);
		width: 10.8rem;
		top: 1.55rem;
	}
	.button_drop_down {
        width: 0.8rem;
        height: 0.8rem;
		transform: rotate(90deg);
	}
	.item {
		padding: 0 0.2rem;
	}
	.item:hover {
		background-color: red;
	}
</style>
