<template>
	<header>

		<TopLogo></TopLogo>
		<TopNav v-bind:isAuthenticated="isAuthenticated"></TopNav>
	</header>
</template>

<script>

import TopNav from './TopNav.vue';
import TopLogo from './TopLogo.vue';

export default {
    name: "Header",
	props: [
		'isAuthenticated'
	],
    components: {
        TopNav,
		TopLogo
    },
	methods: {

	},
	created() {

	}
}
</script>

<style scoped>

header {
	display:flex;
	justify-content: space-between;
	width:100%;
	margin-top:10px;
	align-items: center;
	margin-bottom: 2rem;
}
</style>