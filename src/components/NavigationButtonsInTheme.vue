<template>
	<div class="navigation-buttons-container"
		 :class="{'with-out-left-button': !params.left_src}">
		<div class="button-container"
			 v-if="params.left_src"
			 id = "navigationInTheme_button_container_left">
			<RouterLink :to="params.left_src" class="router-link" @click="srollToTop()">
				<img :src="button_left_src"
				@mouseover="button_left_src = '/myfiles/theme_navigation_buttons/button_left_hover.svg'"
				@mouseleave="button_left_src = '/myfiles/theme_navigation_buttons/button_left.svg'"
				@mousedown="button_left_src = '/myfiles/theme_navigation_buttons/button_left_click.svg'"
				@mouseup="button_left_src = '/myfiles/theme_navigation_buttons/button_left_hover.svg'"
				class="button left-button">
			</RouterLink>
			<div class="theme-name">
				<RouterLink :to="params.left_src" @click="srollToTop()">{{ params.left_theme_name }}</RouterLink>
			</div>
			<div v-if="threePointsLeftShow">
				...
			</div>
		</div>
		<div class="button-container" 
			 v-if="params.right_src"
			 id = "navigationInTheme_button_container_right">
			<div class="theme-name">
				<RouterLink :to="params.right_src" @click="srollToTop()">{{ params.right_theme_name }}</RouterLink>
			</div>
			<div v-if="threePointsRightShow">
				...
			</div>
			<RouterLink :to="params.right_src" class="router-link" @click="srollToTop()">
				<img :src="button_right_src"
				@mouseover="button_right_src = '/myfiles/theme_navigation_buttons/button_right_hover.svg'"
				@mouseleave="button_right_src = '/myfiles/theme_navigation_buttons/button_right.svg'"
				@mousedown="button_right_src = '/myfiles/theme_navigation_buttons/button_right_click.svg'"
				@mouseup="button_right_src = '/myfiles/theme_navigation_buttons/button_right_hover.svg'"
				class="button right-button">
			</RouterLink>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'NavigationButtonsInTheme',
		components: {

		},
		props: [
			'params'
		],
		data(){
			return {
				button_left_src: '/myfiles/theme_navigation_buttons/button_left.svg',
				button_right_src: '/myfiles/theme_navigation_buttons/button_right.svg',
				threePointsLeftShow: false,
				threePointsRightShow: false,
			}
		},
		mounted(){
			this.insertThreePoints();
			window.addEventListener('resize', () => {
				this.insertThreePoints();
			});
		},
		methods:{
			insertThreePoints() {
				let rem = window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0];

				let button_width = 1.5625*rem - 0.4*rem;

				let button_left = document.getElementById('navigationInTheme_button_container_left');
				if (button_left) {
					let container_width = button_left.offsetWidth - button_width;
					let theme_name_width = button_left.querySelector('.theme-name').scrollWidth;
					if (theme_name_width > container_width) {
						this.threePointsLeftShow = true;
					} else {
						this.threePointsLeftShow = false;
					}
				}

				let button_right = document.getElementById('navigationInTheme_button_container_right');
				if (button_right) {
					let container_width = button_right.offsetWidth - button_width;
					let theme_name_width = button_right.querySelector('.theme-name').scrollWidth;
					if (theme_name_width > container_width) {
						this.threePointsRightShow = true;
					} else {
						this.threePointsRightShow = false;
					}
				}
			},
			srollToTop() {
				window.scrollTo({top: 0,behavior: 'smooth'})
			}
		},
		updated() {
			this.insertThreePoints();
		}
	}
</script>

<style lang="less" scoped>
.navigation-buttons-container {
	border: solid white 1px;
	display: flex;
	gap: 0.8rem;
	justify-content: space-between;
	align-items: center;
	padding: 0.6rem;
	background-color: rgba(0,0,0,0.45);
	.button-container {
		display: flex;
		align-items: center;
		max-width: calc(50% - 0.4rem);
		.button {
			height: 1.5625rem;
			width: 1.5625rem;
		}
		.router-link {
			height: 1.5625rem;
		}
		.left-button {
			margin-right: 0.4rem;
		}
		.right-button {
			margin-left: 0.4rem;
		}
		.theme-name {
			color:white;
			font-size: 1rem;
			font-weight: bold;
			overflow: hidden;
			white-space: nowrap;
		}
		.theme-name a {
			color: white;
			font-size: 1rem;
			text-decoration: none;
		}
	}
}
.with-out-left-button {
	justify-content: end;
}
</style>
