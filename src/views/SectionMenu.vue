<template>
	<h2 class="heading">
		<div class="icon-container">
			<div class="icon" title="section.name">
				<img v-bind:src="baseImageURL + section.image">
			</div>
		</div>
		<div class="heading-content">
			{{section.name}}
		</div>
		<div class="button">
			<ButtonDropDown v-on:themeDropDownClick="dropDownAll($event)"/>
		</div>
	</h2>

	<div v-for="(item, i) in themes" :key="i" class="item-and-paragraph-container">
		<div class="item-theme-container">
			<div class="left-button-container">
				<ButtonDropDown v-if="item.image || item.description" v-on:themeDropDownClick="themeDropDownClick($event)" v-bind:parameter="i"
				:pressed="!item.hidden"/>
			</div>
			<div class="main-theme-container" v-bind:class="{'theme-bg-blue': !item.hidden && item.theme_order, 'theme-bg-azure': !item.hidden && !item.theme_order,
			'main-theme-container-hover': !item.hidden}">
				<div class="theme-emoji-name-star-container top-space">
					<div class="theme-emoji-name-container">
						<RouterLink :to="'/' + section.url + '/' + item.url" class="link-emoji">
							<img v-if="item.emoji" v-bind:src="baseImageURL + item.emoji" class="theme-emoji">
						</RouterLink>
						<div class = "theme-name">
							<RouterLink :to="'/' + section.url + '/' + item.url">{{ item.sort }}. {{ item.name }}</RouterLink>
						</div>
					</div>
					<div class="star-container">
						<img v-if="item.isInFavourites" src="/myfiles/star.svg" class="star" @click="addToFavourites(item.id, i)" title="Удалить из избранного">
						<img v-if="!item.isInFavourites" src="/myfiles/empty_star.svg" class="star" @click="addToFavourites(item.id, i)" title="Удалить из избранного">
					</div>
				</div>
				<div v-if="!item.hidden == true
							&& (item.image || item.description)
							&& item.theme_order" 
						class="theme-image-description-container"
						v-bind:class="{'theme-description-bg-blue': item.theme_order, 'theme-description-bg-azure': !item.theme_order}">
					<img v-bind:src="baseImageURL + item.image" class="theme-image">
					<div class="theme-description">
						{{ item.description }}
					</div>
				</div>
				<div v-if="!item.hidden == true 
							&& (item.image || item.description)
							&& !item.theme_order" 
						class="theme-image-description-container"
						v-bind:class="{'theme-description-bg-blue': item.theme_order, 'theme-description-bg-azure': !item.theme_order}">
					<div class="theme-description">
						{{ item.description }}
					</div>
					<img v-bind:src="baseImageURL + item.image" class="theme-image">
				</div>
			</div>
		</div>
    </div>

</template>


<script>
	import { baseUrl, baseImageURL } from '../services/config.js';
	import axios from 'axios';
	import ButtonDropDown from '../components/ButtonDropDown.vue';

	export default {
		name: 'SectionMenu',
		components: {
			ButtonDropDown,
		},
		data(){
			return {
				themes: [],
				section: '',
				sectionURL: this.$route.path,
				baseImageURL: baseImageURL,
				hiddenAllParagraphs: false,
			}
		},
		created(){
			
		},
		methods:{
			async getPagesBySectionUrl(){
				axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
				let url = this.$route.path.slice(1,this.$route.path.length);

				axios
                    .post(baseUrl+'/api/get_themes_and_section_by_section_url',{section_url: url})
                    .then(response => { 
						this.themes = response.data.themes;
						let b = true;
						for (let i = 0; i<this.themes.length; i++) {
							this.themes[i].theme_order = b;
							b = !b;
							this.themes[i].hidden = true;
						}
						this.section = response.data.section;
                    })
                    .catch(error => {
                        console.log(error.response);
                    });

				// let data = await getThemesAndSectionBySectionUrl(url);

			},
			dropDownAll() {
				this.hiddenAllParagraphs = !this.hiddenAllParagraphs;
				for (let i=0;i<this.themes.length; i++) {
					this.themes[i].hidden = !this.hiddenAllParagraphs;
				}
			},
			themeDropDownClick(i) {
				this.themes[i].hidden = !this.themes[i].hidden;
			},
			addToFavourites(id,i) {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                let data = {
                    id: id,
                    type: 'theme'
                }

                if (this.themes[i].isInFavourites) {
                    axios
                    .post(baseUrl+'/api/favourites/remove_from_favourites',data)
                    .then(response => { 
                        if (response.data.status == 'success') {
                            this.themes[i].isInFavourites = false;
                        }
                        // console.log(response.data.status);
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
                } else {
                    axios
                    .post(baseUrl+'/api/favourites/add_to_favourites',data)
                    .then(response => { 
                        if (response.data.status == 'success') {
                            this.themes[i].isInFavourites = true;
                        }
                        // console.log(response.data.status);
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
                }
			},
		},
		async mounted() {
			await this.getPagesBySectionUrl();
		}
	}
</script>

<style lang="less" scoped>
.heading {
	display:flex;
	align-items: center;
	.button {
		transform: translateY(0.2rem);
	}
	.icon-container{
		display:flex;
		justify-content: center;
		align-items: center;
		.icon {
			width:1.6rem;
			height:1.6rem;
			background-color: white;
			display:flex;
			justify-content: center;
			align-items: center;
			img {
				width:75%;
			}
		}
	}
	.heading-content {
		margin-left: 0.3rem;
	}
}
.item-and-paragraph-container {
    margin: 0.4rem 0;
}

.main-theme-container-hover:hover {
	box-shadow: 0rem 0rem 0.6rem white;
}
.item-theme-container {
    display: flex;
    .left-button-container {
        flex-basis: 1.89rem;
        text-align: center;
    }
    .theme-bg-blue{
        background-color: #040085;
    }
    .theme-bg-azure{
        background-color: #010CD3;
    }
    .main-theme-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        .bottom-space {
            margin-bottom: 0.3rem;
        }
        .theme-emoji-name-star-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            // margin-bottom: 0.3rem;
            .theme-emoji-name-container {
                display:flex;
				.link-emoji {
					height: 1.8rem;
				}
				.theme-emoji {
					width: 1.8rem;
					height: 1.8rem;
				}
                .icon-container {
                    margin-right: 0.2rem;
                    transform: translateY(2px);
                }
                .theme-name {
                    padding-left: 0.2rem;
                    padding-top: 0.2rem;
                    font-weight: bold;
                }
            }
            .theme-emoji-name-container a {
                color: white;
                text-decoration: none;
            }
			.star-container {
				font-size:0.7rem;
				display:flex;
				justify-content: center;
				align-items: start;
				min-width: 9rem;
				justify-content: end;
				padding-top: 0.4rem;
				.star {
					width: 1rem;
					height: 1rem;
					margin-right: 0.2rem;
					margin-left: 0.3rem;
					cursor: pointer;
				}
			}

        }
        .theme-image-description-container {
            display: flex;
            width: 100%;
            .theme-image {
                width: 10rem;
				height: 5.7rem;
            }
            .theme-description {
                border-top: 2px #A298ED solid;
                padding-left: 0.4rem;
                width: 100%;
            }
        }
    }
}

</style>
