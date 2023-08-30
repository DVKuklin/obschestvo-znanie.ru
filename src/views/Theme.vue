<template>
    <div v-if="status == 'loading'"><span>Загрузка данных</span></div>

    <div v-if="status == 'success' && $store.getters['appState/getIsAuthenticated']">
        <div class="emoji-heading-container">
            <img class="emoji-img" :src="emoji" v-if="emoji">
            <h1 class="header_1">
                {{theme}}
            </h1>
        </div>
        <div class="buttons-description-container">
            <div class="buttons-container">
                <img src="/myfiles/star.svg" v-if="theme_isFavourite" class="theme_favorite"
                @click="setThemeToFavorites(theme_id)">
                <img src="/myfiles/empty_star.svg" v-if="!theme_isFavourite" class="theme_favorite"
                @click="setThemeToFavorites(theme_id)">
            </div>
            <div class="description-container">
                <div class="description">
                    {{ description }}
                </div>
            </div>
        </div>

        <div class="heading-image-fon-container">

        </div>
        <div class="heading-image-container">
            <img class="heading-image" :src="image">
        </div>
        <div class="heading-image-fon-fade"></div>
        <div class="heading-image-bottom-line"></div>

        <div class="navigation-buttons-container">
            <NavigationButtonsInTheme  :params="navigation_params"/>
        </div>

        <div class="conForThem">
            <div v-for="(item, i) in paragraphs" :key="i"  class="paragraph" :id = "'paragraph_'+item.id">
                <div class="content" v-html="item.content"></div>
                <img src="/myfiles/favorite.png" v-if="item.isInFavorites" class="favorite"
                @click="setParagraphToFavorites(item.id,i)">
                <img src="/myfiles/not_favorite.png" v-if="!item.isInFavorites" class="favorite"
                @click="setParagraphToFavorites(item.id,i)">
            </div>
        </div>
        
        <div class="navigation-buttons-container">
            <NavigationButtonsInTheme :params="navigation_params"/>
        </div>
    </div>

    <StatusMessage v-if="status == 'notAuth' || !$store.getters['appState/getIsAuthenticated']" v-bind:status="'notAuth'"></StatusMessage>
    <StatusMessage v-if="status == 'notAllowed'" v-bind:status="status"></StatusMessage>
    <StatusMessage v-if="status == 'notFound'" v-bind:status="status"></StatusMessage>

</template>

<script>
    import StatusMessage from '../components/StatusMessage.vue';
    import NavigationButtonsInTheme from '../components/NavigationButtonsInTheme.vue';
    import axios from 'axios';
    import {baseUrl, baseUrlImages} from '../services/config.js';
    import {changeBloquoteToSummary, alignMarker} from '../services/methods.js';


    import { getParagraphsAndThemeByUrl } from '../services/methods.js';
    export default {
        name: 'Theme',
        components: {StatusMessage, NavigationButtonsInTheme},
        data() {
            return {
                paragraphs: [],
                theme: '',
                theme_isFavourite: false,
                sectionURL:'',
                section:'',
                image:null,
                emoji:null,
                description: '',
                status: 'loading',
                navigation_params: {
                    left_src: null,
                    left_theme_name: null,
                    right_src: 'null',
                    right_theme_name: 'null'
                },
            }
        },
        async created() {
            this.getData();
        },
        methods: {
            getData() {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

            let str = this.$route.path.slice(1,this.$route.path.length);
            let urls = str.split("/");
            let data = {
                section_url: urls[0],
                theme_url: urls[1]
            }

            axios
                .post(baseUrl+'/api/get_paragraps_by_section_and_theme_url',data)
                .then(response => { 
                    if (response.data.status == 'notAuth' || response.data.status == 'notAuth') {
                        this.status='notAuth';
                    } else if (response.data.status == 'success') {console.log(response.data);
                        this.paragraphs = response.data.paragraphs;
                        this.theme = response.data.theme;
                        this.theme_isFavourite = response.data.theme_isFavourite;
                        this.theme_id = response.data.theme_id;
                        this.status='success';
                        if (response.data.image) this.image=baseUrlImages+response.data.image;
                        if (response.data.emoji) this.emoji=baseUrlImages+response.data.emoji;
                        this.description = response.data.description;
                        this.navigation_params = response.data.navigation_params;
                        this.$store.commit('appState/setCurrentThemeName',response.data.theme);
                        this.$store.commit('appState/setCurrentSectionUrl','/'+data.section_url);
                        this.$store.commit('appState/setCurrentSectionName',response.data.section);
                    } else if (response.data.status == 'notAllowed') {
                        this.status='notAllowed';
                    } else if (response.data.status == 'notFound') {
                        this.status='notFound';
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        this.status = 'notAuth';
                    }
                    console.log(error.response);
                });
            },
            setParagraphToFavorites(id,i) {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                let data = {
                    id: id,
                    type: 'paragraph'
                }

                if (this.paragraphs[i].isInFavorites) {
                    axios
                    .post(baseUrl+'/api/favourites/remove_from_favourites',data)
                    .then(response => { 
                        if (response.data.status == 'success') {
                            this.paragraphs[i].isInFavorites = false;
                        }
                        // console.log(response.data.status);
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            this.status = 'notAuth';
                        }
                        console.log(error.response);
                    });
                } else {
                    axios
                    .post(baseUrl+'/api/favourites/add_to_favourites',data)
                    .then(response => { 
                        if (response.data.status == 'success') {
                            this.paragraphs[i].isInFavorites = true;
                        }
                        // console.log(response.data.status);
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            this.status = 'notAuth';
                        }
                        console.log(error.response);
                    });
                }
            },
            setThemeToFavorites(id) {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                let data = {
                    id: id,
                    type: 'theme'
                }

                if (this.theme_isFavourite) {
                    axios
                    .post(baseUrl+'/api/favourites/remove_from_favourites',data)
                    .then(response => { 
                        if (response.data.status == 'success') {
                            this.theme_isFavourite = false;
                        }
                        // console.log(response.data.status);
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            this.status = 'notAuth';
                        }
                        console.log(error.response);
                    });
                } else {
                    axios
                    .post(baseUrl+'/api/favourites/add_to_favourites',data)
                    .then(response => { 
                        if (response.data.status == 'success') {
                            this.theme_isFavourite = true;
                        }
                        // console.log(response.data.status);
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            this.status = 'notAuth';
                        }
                        console.log(error.response);
                    });
                }
            }
        },
        updated() {
            //Выравниваем маркеры
            alignMarker();
            //Замена bockquote на details
            changeBloquoteToSummary();     

            //Если перешли из избранного, то прокручиваем до элемента
            let id = localStorage.getItem('scrollTo');

            if (id) {
                localStorage.removeItem('scrollTo');
                let el = document.getElementById('paragraph_'+id);
                if (el) {
                    el.scrollIntoView({'behavior':'smooth'});
                }
            }  
        },
        watch: {
            $route (to, from){
                this.getData();
            }
        }
    }

</script>

<style lang="less" scoped>
    .conForThem {
        background-color: white;
        color: black;
        padding: 10px;
        padding-top: 2.5rem;
        margin-bottom: 5px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }

    .paragraph {
        position:relative;
        margin: 20px 0;
    }

    .paragraph:hover {
        box-shadow:0 0 20px rgb(226, 233, 226);
    }

    .favorite {
        position:absolute;
        bottom: -5px;
        right: 5px;
        width:1rem;
        cursor:pointer;
    }

    .img-heading {
        position: relative;
        box-sizing: border-box;
    }
    .main-img {
        width: 100%;
        display: block;
    }

    .emoji-heading-container{
        height: 3.75rem;
        margin-bottom: 0.4rem;
        .emoji-img {
            width: 3.75rem;
            height: 3.75rem;
            float: left;
            margin-right: 0.4rem;
        }
        .header_1 {
            font-family: 'Open Sans', sans-serif;
            font-size: 1.4rem;
            margin: 0;
            max-width: 800px;
            overflow-y: hidden;
            height: 3.75rem;
        }
    }
    .buttons-description-container {
        height: 16.6875rem;
        @media screen and (max-width: 600px) {
            height: 16.4rem;
        }
        @media screen and (max-width: 400px) {
            height: 16.2rem;
        }
        @media screen and (max-width: 278px) {
            height: 15.5rem;
        }
        display: flex;
        .buttons-container {
            display: flex;
            flex-direction: column;
            width: fit-content;
            background-color: rgba(96,93,207,0.46);
            height: 100%;
            .theme_favorite {
                width:1.875rem;
                cursor:pointer;
            }
        }
        .description-container {
            align-self: end;
            margin-left: 1.875rem;
            max-width: 760px;
            min-height: 7.8rem;
            display: flex;
            .description {
                vertical-align: text-top;
                padding-left: 0.4rem;
                border-left: white solid 2px;
            }
        }
    }
    .navigation-buttons-container {
        margin: 1rem 0;
    }
    .heading-image-fon-container {
        position: absolute;
        top:0;
        left: 0;
        height: 30rem;
        z-index: -4;
        width: 100%;
        background-image: url('/myfiles/heading-image-background_mobile.jpg');
        background-position: center;
        background-size: cover;
    }

    .heading-image-container {
        position: absolute;
        top:0;
        left: 0;
        height: 30rem;
        width: 100%;
        z-index: -3;
        display: flex;
        justify-content: center;
        overflow: hidden;
        .heading-image {
            height: 100%;
        }
    }
    .heading-image-fon-fade {
        position: absolute;
        top:0;
        left: 0;
        height: 30rem;
        width: 100%;
        background-color: rgba(0,0,0,0.65);
        z-index: -2;
    }
    .heading-image-bottom-line {
        position: absolute;
        top:0;
        left: 0;
        height: 29.8rem;
        width: 100%;
        border-bottom: 2px white solid;
        z-index: -1;
    }

</style>

<script>


</script>