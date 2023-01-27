<template>
    <div v-if="status == 'loading'"><span>Загрузка данных</span></div>
    <div v-if="status == 'success'" class="conForThem">
        <h3 align="center">{{theme}}</h3>
        <div v-for="(item, i) in paragraphs" :key="i"  class="paragraph">
            <div class="content" v-html="item.content"></div>
            <img src="/myfiles/plus.png" 
                 v-if="!item.isInFavorites" 
                 class="btn-favorite"
                 @click="setParagraphToFavorites(item.id,i)"
                 title="Добавить в избранное">
            <img src="/myfiles/minus.png" 
                 v-if="item.isInFavorites" 
                 class="btn-favorite"
                 @click="setParagraphToFavorites(item.id,i)"
                 title="Удалить из избранного">
            <img src="/myfiles/favorite.png" v-if="item.isInFavorites" class="favorite">
        </div>
    </div>

    <StatusMessage v-if="status == 'notAuth'" v-bind:status="status"></StatusMessage>
    <StatusMessage v-if="status == 'notAllowed'" v-bind:status="status"></StatusMessage>
    <StatusMessage v-if="status == 'notFound'" v-bind:status="status"></StatusMessage>

</template>

<script>
    import StatusMessage from '../components/StatusMessage.vue';
    import axios from 'axios';
    import {baseUrl} from '../services/config.js';
    import {changeBloquoteToSummary} from '../services/methods.js';


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

                    } else if (response.data.status == 'notAllowed') {
                        this.status='notAllowed';
                    } else if (response.data.status == 'notFound') {
                        this.status='notFound';
                    }
                    console.log(response.data);
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
                        console.log(response.data.status);
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
        mounted() {

        },
        updated() {
            //Замена bockquote на details
            changeBloquoteToSummary();

        }

    }

</script>

<style scoped>
    .conForThem {
        background-color: white;
        color: black;
        padding: 10px;
        border-radius: 3px;
        margin-bottom: 5px;
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
    }

    .btn-favorite {
        cursor: pointer;
        position:absolute;
        top: -1rem;
        left: -0.5rem;
        width:0.8rem;
        background-color: white;  
    }

</style>

<script>


</script>