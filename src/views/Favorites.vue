<template>
    <div v-for="(item, i) in favorites" :key="i">
        <div class="item-container">
            <div class="item-inner-container">
                <div class="icon-container">
                    <div class="icon" :title="item.section_name">
                        <img v-bind:src="item.section_image">
                    </div>
                </div>
                <div class="section-theme-name">
                    <!-- <h3 class="section-name">{{ item.section_name }}</h3> -->
                    <div>{{ item.theme_sort }}. {{ item.theme_name }}</div>
                </div>
            </div>
            <div class="date-time">
                {{ item.date_time }}
            </div>
        </div>
        <div class="paragraph-container">
            <div class="btn-panel">
                <img src="/myfiles/minus.png" @click="deleteParagraphFromFavorites(item.id)" title="Удалить из избранного">
                <img src="/myfiles/maximize.png" @click="maximizeParagraph(item.id)" :id="'maximize_'+item.id" title="Развернуть">
            </div>
            <div class="content-container" :id="'paragraph_'+item.id">
                <div v-html="item.content"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { baseUrlImages } from '../services/config.js';
    import axios from 'axios';
    import {baseUrl} from '../services/config.js';
    import {changeBloquoteToSummary} from '../services/methods.js';

    export default {
        name: 'Favorites',
        components: {},
        data() {
            return {
                favorites: [],
            }
        },
        created() {
            this.getData();


        },
        methods: {
            getData() {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
                let data = {
                    'sort':'date_time_desc'
                }

                axios
                .post(baseUrl+'/api/get_data_for_favorites',data)
                .then(response => { 
                    if (response.data.status=='success') {
                        let favorites = response.data.favorites;

                        // console.log(favorites);

                        for (let i=0;i<favorites.length;i++) {
                            favorites[i].section_image = baseUrlImages+favorites[i].section_image;
                        }

                        this.favorites = favorites;
                        // console.log(this.favorites);
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        this.status = 'notAuth';
                        this.$router.replace('/');
                    }
                    console.log(error.response);
                });
            },

            deleteParagraphFromFavorites(id) {
                if (!confirm('Подтвердите удалене параграфа из избранного.')) return;
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                let data = {
                    paragraph_id: id
                }

                axios
                .post(baseUrl+'/api/delete_paragraph_from_favorites',data)
                .then(response => { 
                    if (response.data.status == 'success') {
                        this.getData();
                    }
                    // console.log(response.data.status);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        this.status = 'notAuth';
                    }
                    console.log(error.response);
                });
            },

            maximizeParagraph(id) {
                let btn = document.getElementById('maximize_'+id);
                let paragraph = document.getElementById('paragraph_'+id);
                
                if (btn.style.transform == 'rotate(180deg)') {
                    paragraph.style.maxHeight='4rem';
                    btn.style.transform = 'none';
                    btn.setAttribute('title','Развернуть');             
                } else {
                    paragraph.style.maxHeight='none';
                    btn.style.transform = 'rotate(180deg)';
                    btn.setAttribute('title','Свернуть');
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
.item-container{
    display: grid;
    grid-template-columns: auto  auto;
    justify-content: space-between;
    margin-top:0.8rem;
    margin-bottom:0.5rem;
}

.item-inner-container{
    display: grid;
    grid-template-columns: 2rem  auto;
}

.section-theme-name {
    margin:0 0.4rem;
}

.date-time {
    font-size:0.7rem;
    display:flex;
    justify-content: center;
    align-items: center;
}

.section-name {
    margin:0.1rem 0;
}
.content-container {
    background-color: white;
    color: black;
    padding: 10px;
    border-radius: 3px;
    margin-bottom: 5px;
    font-family: 'Arial';
	font-size: 0.91rem;
    max-height: 4rem;
    overflow: auto;
}
.icon-container{
    display:flex;
    justify-content: center;
    align-items: center;
}
.icon {
    width:1.6rem;
    height:1.6rem;
    background-color: white;
    display:flex;
    justify-content: center;
    align-items: center;
}

.icon img {
    /* background-color: white; */
    width:75%;
}


.paragraph-container{
    position:relative;
}
.btn-panel {
        cursor: pointer;
        position:absolute;
        top: 0.1rem;
        left: 0.1rem;
        background-color: white;  
}

.btn-panel img {
    width:0.9rem;
    margin:0.1rem;
}
</style>
