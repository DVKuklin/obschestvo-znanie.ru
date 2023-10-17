<template>
	<div class="modal-container">
        <div class="fade" @click="$emit('close')"></div>
		<div class="modal">
			<img src="/myfiles/modal/button-close.svg"
				 class="button-close"
				 @click="$emit('close')">
			<slot></slot>
		</div>
		

	</div>

</template>

<script>
	export default {
		name: 'BaseModal',
		components: {

		},
		data(){
			return {
				data: [],
			}
		},
		async created(){

		},
		methods:{

		}
	}
</script>

<style lang="less" scoped>
.modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;
	.fade {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.45);
	}
	.modal {
		display: flex;
		flex-direction: column;
		background-color: #0000D5;
		padding: 1rem;
		position: relative;
		border: solid white 1px;
		width: 214px;
		box-shadow: 0 0 20px white;
		.button-close {
			position: absolute;
			top: 0.4rem;
			right: 0.4rem;
			cursor: pointer;
			width: 0.5rem;
			height: 0.5rem;
		}
		.content {
			color: red;
		}
	}
}
</style>
