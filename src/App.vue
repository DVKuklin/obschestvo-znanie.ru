<template>
<div id="conForAll">
    <div>
		<Header v-bind:isAuthenticated="isAuthenticated"></Header>
		<BreadCrumbs v-if="isTheme"></BreadCrumbs>
			<main>
				<div id="conForContent">
					<RouterView 
					v-on:authenticate="authenticate()"
					v-on:notAuthenticate="notAuthenticate()"></RouterView>
				</div>
		
			</main>
	</div>


	<div>
		<BreadCrumbs v-if="isTheme"></BreadCrumbs>
		<Footer></Footer>
	</div>
</div>	
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/includes/Header/Header.vue'
import Footer from './components/includes/Footer.vue';
import BreadCrumbs from './components/BreadCrumbs.vue';
import axios from 'axios';
import {baseUrl} from './services/config.js';

export default {
	components: {
		Header, Footer, BreadCrumbs
	},
	data() {
		return {
			isTheme: false,
			isAuthenticated: false
		};
	},
	methods: {
		//После авторизации показать пункт меню избранное
		authenticate() {
			this.isAuthenticated = true;
		},
		//После разлогинивания убрать пункт меню избранное
		notAuthenticate() {
			this.isAuthenticated = false;
		}
	},
	created() {
		//Определяем является ли пользователеь авторизованным, что бы показать/не показать пунк избранное

		axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
        axios
            .get(baseUrl+'/api/is_authenticated')
            .then(response => { 
                if (response.data.status=='success') {
                    this.isAuthenticated = true;
                }
                // console.log(response.data);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    console.log('notAuth')
                }
                // console.log(error.response);
            });
    },
	mounted() {

	},
	watch: {
		$route (to, from){
			if (this.$route.meta.isTheme) {
				this.isTheme = true
			} else {
				this.isTheme = false
			}
		}
    },

}


</script>



<style scoped>
#conForAll {
	/*background-color:rgb(3,50,203);*/
	max-width:1000px;
	margin-left:auto;
	margin-right:auto;
	color:white;
	display:flex;
	height:100%;
	flex-direction:column;
	justify-content: space-between;
	padding:0 10px;
}

#conForContent {
    /* padding:10px; */
}

main {

}
</style>
