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
	display:grid;
	grid-template-columns: 370px auto;
	width:100%;
	margin-top:10px;
}

@media screen and (max-width:771px){
	header {
		grid-template-columns: 100%;
	}
}






</style>