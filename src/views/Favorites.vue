<template>
    <div class="tools-panel">
        <div class="sorting">
            Сортировать по
            <select @change="sortSelect" id = "select_sort_by">
                <option value="date_time_desc">дате по убыванию</option>
                <option value="date_time_asc">дате по возрастанию</option>
                <option value="section_theme_asc">разделу, теме по возрастанию</option>
                <option value="section_theme_desc">разделу, теме по убыванию</option>
            </select>
        </div>
 
        <PaginateButtons   v-bind:links="links" v-on:goToNewPage="getData($event)">
        </PaginateButtons>
    </div>
    <div v-for="(item, i) in favorites" :key="i" class="item-and-paragraph-container">
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
                <img src="/myfiles/maximize.png" @click="maximizeParagraph(item.id)" :id="'maximize_'+item.id" title="Развернуть" class="button-maximize">
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
    import PaginateButtons from '../components/PaginateButtons/PaginateButtons.vue';

    export default {
        name: 'Favorites',
        components: {PaginateButtons},
        data() {
            return {
                favorites: [],
                links: [],
            }
        },
        created() {


            let url = baseUrl+'/api/get_data_for_favorites_order_by_section_theme_asc';

            if (localStorage.getItem('favorites_pagination_url')) {
                url = localStorage.getItem('favorites_pagination_url')
            }

            this.getData(url);
        },
        methods: {
            getData(url) {

                if (url==null) return;
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                axios
                .post(url)
                .then(response => { 
                    if (response.data.status=='success') {
                        
                        let favorites = response.data.favorites.data;

                        for (let i=0;i<favorites.length;i++) {
                            favorites[i].section_image = baseUrlImages+favorites[i].section_image;
                        }

                        this.favorites = favorites;
                        this.links = response.data.favorites.links;
                        this.links[0].label = "<";
                        this.links[this.links.length-1].label = ">"; 

                        localStorage.setItem('favorites_pagination_url',url)
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

            sortSelect(){
                localStorage.setItem('sortSelectIndex',select_sort_by.options.selectedIndex);
                let url = baseUrl+'/api/get_data_for_favorites_order_by_'+select_sort_by.options[select_sort_by.options.selectedIndex].value;

                this.getData(url);
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
                        this.getData(localStorage.getItem('favorites_pagination_url'));
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

            //Добавляем кнопку развернуть/свернуть, если ширина контента большая
            let buttons = document.querySelectorAll('.button-maximize');
            for (let i=0;i<buttons.length;i++) {
                buttons[i].style.display='inline';
            }
            let content_containers = document.getElementsByClassName('content-container');
            
            for (let i = 0;i<content_containers.length;i++){

                if (content_containers[i].scrollHeight <= content_containers[i].offsetHeight) {
                    let m=content_containers[i].id.split('_');
                    let button = document.getElementById('maximize_'+m[1]);
                    button.style.display="none";
                }
            }

            //Устанавливаем sortSelect
            if (localStorage.getItem('sortSelectIndex')) {
                select_sort_by.options.selectedIndex = localStorage.getItem('sortSelectIndex');
            }

        }

    }

</script>

<style scoped>
.item-and-paragraph-container {
    margin: 1.5rem 0;
}
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
    padding-top: 1.6rem;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    /* padding: 10px 10px; */
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

.tools-panel {
    margin: 0.8rem 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.sorting {
    margin: 0.4rem 0; 
}
/* #select_sort_by {
    background-color: rgb(134, 134, 197,0.0);
    color:white;
    border:white 2px solid;
    border-radius: 4px;
} */

.button-maximize {
    display: none;
}
</style>
