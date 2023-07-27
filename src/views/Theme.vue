<template>
    <div v-if="status == 'loading'"><span>Загрузка данных</span></div>

    <div class="img-heading">
        <img class="main-img" :src="image" v-if="image">
        <img class="emoji-img" :src="emoji" v-if="emoji">
    </div>

    <div v-if="status == 'success'" class="conForThem">

        <h1 align="center" class="header_1">{{theme}}</h1>
        <div v-for="(item, i) in paragraphs" :key="i"  class="paragraph" :id = "'paragraph_'+item.id">
            <div class="content" v-html="item.content"></div>
            <img src="/myfiles/favorite.png" v-if="item.isInFavorites" class="favorite"
            @click="setParagraphToFavorites(item.id,i)">
            <img src="/myfiles/not_favorite.png" v-if="!item.isInFavorites" class="favorite"
            @click="setParagraphToFavorites(item.id,i)">
        </div>
    </div>

    <StatusMessage v-if="status == 'notAuth'" v-bind:status="status"></StatusMessage>
    <StatusMessage v-if="status == 'notAllowed'" v-bind:status="status"></StatusMessage>
    <StatusMessage v-if="status == 'notFound'" v-bind:status="status"></StatusMessage>

</template>

<script>
    import StatusMessage from '../components/StatusMessage.vue';
    import axios from 'axios';
    import {baseUrl, baseUrlImages} from '../services/config.js';
    import {changeBloquoteToSummary, alignMarker} from '../services/methods.js';


    import { getParagraphsAndThemeByUrl } from '../services/methods.js';
    export default {
        name: 'Theme',
        components: {StatusMessage},
        data() {
            return {
                paragraphs: [],
                theme: '',
                sectionURL:'',
                section:'',
                image:null,
                emoji:null,
                status: 'loading'
            }
        },
        async created() {
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
                    } else if (response.data.status == 'success') {
                        this.paragraphs = response.data.paragraphs;
                        this.theme = response.data.theme;
                        this.status='success';
                        if (response.data.image) this.image=baseUrlImages+response.data.image;
                        if (response.data.emoji) this.emoji=baseUrlImages+response.data.emoji;

                    } else if (response.data.status == 'notAllowed') {
                        this.status='notAllowed';
                    } else if (response.data.status == 'notFound') {
                        this.status='notFound';
                    }
                    // console.log(response.data);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        this.status = 'notAuth';
                    }
                    console.log(error.response);
                });
        },
        methods: {
            setParagraphToFavorites(id,i) {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                let data = {
                    paragraph_id: id
                }

                if (this.paragraphs[i].isInFavorites) {
                    axios
                    .post(baseUrl+'/api/delete_paragraph_from_favorites',data)
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
                    .post(baseUrl+'/api/set_paragraph_to_favorites',data)
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
        }

    }

</script>

<style scoped>
    .header_1 {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.4rem;
    }

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

    .emoji-img {
        position:absolute;
        width: 5rem;
        bottom: -2.5rem;
        left: 2rem;
    }

</style>

<script>


</script>