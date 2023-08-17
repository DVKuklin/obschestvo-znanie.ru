<template>
    <div class="tools-panel">
        <div class="selects-container">
            <div class="select-container select-filter-order">
                <div class="sort-by">Сортировать по</div>
                <CustomSelect v-model="filter_order"
                        :placeHolder="''"
                        :options="filter_order_options"
                        v-on:change="sortSelect"
                        :width="16"></CustomSelect>
            </div>
            <div class="select-container">
                Показать
                <CustomSelect v-model="filter_type"
                        :placeHolder="''"
                        :options="filter_type_options"
                        v-on:change="selectTypeChange"
                        :width="8"></CustomSelect>
            </div>

        </div>
 
        <PaginateButtons v-bind:links="links" v-bind:query="query">
        </PaginateButtons>

    </div>
    <div v-if="favourites.length == 0">В избранном пока ничего нет</div>
    <div v-else v-for="(item, i) in favourites" :key="i" class="item-and-paragraph-container">
        <div v-if="item.type == 'paragraph'">
            <div class="item-theme-container">
                <div class="left-button-container">
                    <ButtonDropDown v-on:themeDropDownClick="maximizeParagraph($event)" v-bind:parameter="item.id" :button_id="'maximize_'+item.id" className="button-maximaze"/>
                </div>
                <div class="main-theme-container">
                    <div class="theme-emoji-name-star-container bottom-space">
                        <div class="theme-emoji-name-container">
                            <RouterLink :to="'/'+item.section_url">
                                <div class="icon-container">
                                    <div class="icon" :title="item.section_name">
                                        <img v-bind:src="baseImageURL + item.section_image">
                                    </div>
                                </div>
                            </RouterLink>
                            <RouterLink :to="'/' + item.section_url + '/' + item.theme_url" class="emoji-link">
                                <img v-if="item.theme_emoji" v-bind:src="baseImageURL + item.theme_emoji" class="theme-emoji">
                            </RouterLink>
                            <div class = "theme-name">
                                <RouterLink :to="'/' + item.section_url + '/' + item.theme_url" @click="setScroll(item.id)">{{ item.theme_sort }}. {{ item.theme_name }}</RouterLink>
                            </div>
                        </div>
                        <div class="date-time">
                            {{ item.date_time }}<img src="/myfiles/star.svg" class="star" @click="removeFromFavourites(item.id,item.type)" title="Удалить из избранного">
                        </div>
                    </div>
                </div>
            </div>

            <div class="paragraph-container">
                <div class="content-container conForThem paragraph" :id="'paragraph_'+item.id">
                    <div v-html="item.content"></div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="item-theme-container">
                <div class="left-button-container">
                    <ButtonDropDown v-if="item.theme_image || item.theme_description" v-on:themeDropDownClick="themeDropDownClick($event)" v-bind:parameter="i"/>
                </div>
                <div class="main-theme-container" v-bind:class="{'theme-bg-blue': item.theme_order, 'theme-bg-azure': !item.theme_order}">
                    <div class="theme-emoji-name-star-container top-space">
                        <div class="theme-emoji-name-container">
                            <RouterLink :to="'/'+item.section_url">
                                <div class="icon-container">
                                    <div class="icon" :title="item.section_name">
                                        <img v-bind:src="baseImageURL + item.section_image">
                                    </div>
                                </div>
                            </RouterLink>
                            <RouterLink :to="'/' + item.section_url + '/' + item.theme_url" class="theme-emoji">
                                <img v-if="item.theme_emoji" v-bind:src="baseImageURL + item.theme_emoji" class="theme-emoji">
                            </RouterLink>
                            <div class = "theme-name">
                                <RouterLink :to="'/' + item.section_url + '/' + item.theme_url">{{ item.theme_sort }}. {{ item.theme_name }}</RouterLink>
                            </div>
                        </div>
                        <div class="date-time">
                            {{ item.date_time }}<img src="/myfiles/star.svg" class="star" @click="removeFromFavourites(item.id,item.type)" title="Удалить из избранного">
                        </div>
                    </div>
                    <div v-if="!item.theme_hidden
                                && (item.theme_image || item.theme_description)
                                && item.theme_order" 
                            class="theme-image-description-container"
                            v-bind:class="{'theme-description-bg-blue': item.theme_order, 'theme-description-bg-azure': !item.theme_order}">
                        <img v-bind:src="baseImageURL + item.theme_image" class="theme-image">
                        <div class="theme-description">
                            {{ item.content }}
                        </div>
                    </div>
                    <div v-if="!item.theme_hidden == true 
                                && (item.theme_image || item.theme_description)
                                && !item.theme_order" 
                            class="theme-image-description-container"
                            v-bind:class="{'theme-description-bg-blue': item.theme_order, 'theme-description-bg-azure': !item.theme_order}">
                        <div class="theme-description">
                            {{ item.content }}
                        </div>
                        <img v-bind:src="baseImageURL + item.theme_image" class="theme-image">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="tools-panel">
        <CountPaginatePage v-bind:limit="limit" v-on:changePageCount="changePageCount($event)"/>
        <PaginateButtons v-bind:links="links" v-bind:query="query">
        </PaginateButtons>
    </div>
</template>

<script>
    import axios from 'axios';
    import {baseUrl, baseImageURL} from '../services/config.js';
    import {changeBloquoteToSummary, alignMarker} from '../services/methods.js';
    import PaginateButtons from '../components/PaginateButtons/PaginateButtons.vue';
    import CustomSelect from '../components/CustomSelect.vue';
    import { RouterLink } from 'vue-router';
    import ButtonDropDown from '../components/ButtonDropDown.vue';
    import CountPaginatePage from '../components/CountPaginatePage.vue';

    export default {
        name: 'Favorites',
        components: {PaginateButtons, ButtonDropDown, CountPaginatePage, CustomSelect},
        data() {
            return {
                favourites: [],
                links: [],
                query: {},
                baseImageURL: baseImageURL,
                filtersList: [
                    'page',
                    'limit',
                    'order',
                    'orderBy',
                    'type',
                ],
                filters: {},
                defaultFilters: {
                    page: 1,
                    limit: 5,
                    order: 'DESC',
                    orderBy: 'date_time'
                },
                limit: 5,
                filter_type: 'all',
                filter_order: 'date_time_desc',
                filter_order_options: [
                    {value: 'date_time_desc', name:'дате по убыванию'},
                    {value: 'date_time_asc',  name:'дате по возрастанию'},
                    {value: 'section_theme_asc', name:'разделу, теме по возрастанию'},
                    {value: 'section_theme_desc', name:'разделу, теме по убыванию'}
                ],
                filter_type_options: [
                    {value: 'all', name:'все'},
                    {value: 'paragraph',  name:'параграфы'},
                    {value: 'theme', name:'темы'}
                ],
            }
        },
        created() {

        },
        methods: {
            getData() {
                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
                
                axios
                .post(baseUrl+'/api/favourites/get_favourites',this.filters)
                .then(response => {
                    this.favourites = response.data.favourites.data;
                    this.links = response.data.favourites.links;
                    
                    let current_page = response.data.favourites.current_page;
                    if ( (current_page > 1 && this.favourites.length == 0) ||
                        (current_page < this.$route.query.page) ) {
                        let newQuery = {}
                        Object.assign(newQuery,this.$route.query);

                        newQuery.page = current_page;
                        this.$router.push({ name: 'Favourites', query: newQuery });
                        return;
                    }

                    let query = this.$route.query;
                    let queryWithOutFilters = {};
                    
                    Object.keys(query).forEach((e) => {
                        if (!this.filtersList.includes(e)) {
                            queryWithOutFilters[e] = query[e];
                        }
                    })
                    
                    this.query = {};

                    Object.assign(this.query, queryWithOutFilters, response.data.favourites.query);

                    let theme_order = true;
                    this.favourites.forEach((item,i,mas) => {
                        if (item.type == 'theme') {
                            mas[i].theme_hidden = true;
                            if (i>1 && mas[i-1].type == 'paragraph') {
                                theme_order = true;
                            }
                            if (theme_order) {
                                mas[i].theme_order = true;
                                theme_order = false;
                            } else {
                                mas[i].theme_order = false;
                                theme_order = true;
                            }
                        }
                    })
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401) {
                        this.status = 'notAuth';
                        this.$router.replace('/');
                    }
                    console.log(error.response);
                });
            },

            sortSelect(){
                let page = '';
                if (this.$route.query.page) {
                    page = this.$route.query.page;
                }
                let limit = '';
                if (this.$route.query.limit) {
                    limit = this.$route.query.limit;
                }
                this.filters = {};

                switch (this.filter_order) {
                    case 'date_time_desc': {
                        break;
                    }
                    case 'date_time_asc': {
                        this.filters = {order: 'ASC'};
                        break;
                    }
                    case 'section_theme_desc': {
                        this.filters = {orderBy: 'sort'};
                        break;
                    }
                    case 'section_theme_asc': {
                        this.filters = {orderBy: 'sort', order: 'ASC'};
                        break;
                    }
                }

                let newQuery = {};
                Object.keys(this.$route.query).forEach((e) => {
                    if (!this.filtersList.includes(e)) {
                        newQuery[e] = this.$route.query[e];
                    }
                })

                if (page) {
                    this.filters['page'] = page;
                }

                if (limit) {
                    this.filters['limit'] = limit;
                }

                Object.keys(this.filters).forEach((e) => {
                    newQuery[e] = this.filters[e];
                })

                this.$router.push({ name: 'Favourites', query: newQuery });
                this.getData();
            },

            maximizeParagraph(id) {
                let btn = document.getElementById('maximize_'+id);
                let paragraph = document.getElementById('paragraph_'+id);

                if (btn.querySelector('img').classList.contains('is-pressed')) {
                    paragraph.style.maxHeight='4rem';
                } else {
                    paragraph.style.maxHeight='none';
                }
            },

            setScroll(id) {
                localStorage.setItem('scrollTo',id)
            },

            themeDropDownClick(i) {
                if (this.favourites[i].theme_hidden) {
                    this.favourites[i].theme_hidden = false;
                } else {
                    this.favourites[i].theme_hidden = true;
                }
            },
            removeFromFavourites(id,type) {
                //Если мобильное, то подтвердить удаление
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                    if (!confirm('Подтвердите удалене параграфа из избранного.')) return;
                } 

                axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');

                axios
                .post(baseUrl+'/api/favourites/remove_from_favourites',{id: id, type: type})
                .then(response => {
                    if (response.data.status == 'success') {
                        this.getData();
                    } else {
                        alert('Ошибка, удаление не произошло.');
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
            updateData() {
                //Выравниваем маркеры
                alignMarker();

                //Замена bockquote на details
                changeBloquoteToSummary();
                //Разворачиваем details
                let details = document.querySelectorAll('.conForThem .summary_before');
                for (let i=0;i<details.length;i++) {
                    showSummary(details[i]);
                }

                //Добавляем кнопку развернуть/свернуть, если ширина контента большая
                let buttons = document.querySelectorAll('.button-maximize');
                for (let i=0;i<buttons.length;i++) {
                    buttons[i].style.display='flex';
                }
                let content_containers = document.getElementsByClassName('content-container');
                
                let rem = window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0];
                for (let i = 0;i<content_containers.length;i++){

                    if (content_containers[i].scrollHeight <= 4*rem+34) {
                        let m=content_containers[i].id.split('_');
                        let button = document.getElementById('maximize_'+m[1]);
                        button.style.display="none";
                    }
                }

                //Обратно сворачиваем details
                for (let i=0;i<details.length;i++) {
                    showSummary(details[i]);
                }
            },
            queryToFilters() {
                this.filters = {};
                const query = this.$route.query;
                this.filtersList.forEach(item => {
                    if (query[item]) {
                        this.filters[item] = query[item];
                    }
                });
                this.limit = 5;
                if (query.limit) {
                    switch (query.limit) {
                        case '5': this.limit = 5; break;
                        case '10': this.limit = 10; break;
                        case '15': this.limit = 15; break;
                        case 'all': this.limit = 'all'; break;
                        default: this.limit = 5; break;
                    }
                }
            },
            setFiterSelects() {
                let sorting = '';
                if (
                    (!this.filters['orderBy'] || this.filters['orderBy'] == 'date_time') &&
                    (!this.filters['order'] || this.filters['order'] == 'DESC')
                ) {
                    sorting = 'date_time_desc';
                }
                if (
                    (!this.filters['orderBy'] || this.filters['orderBy'] == 'date_time') &&
                    (this.filters['order'] == 'ASC')
                ) {
                    sorting = 'date_time_asc';
                }
                if (
                    (this.filters['orderBy'] == 'sort') &&
                    (!this.filters['order'] || this.filters['order'] == 'DESC')
                ) {
                    sorting = 'section_theme_desc';
                }
                if (
                    this.filters['orderBy'] == 'sort' &&
                    this.filters['order'] == 'ASC'
                ) {
                    sorting = 'section_theme_asc';
                }

                this.filter_order = sorting;

                if (this.filters['type']) {
                    this.filter_type = this.filters['type'];
                }
            },
            changePageCount(count) {
                if (this.limit == count) {
                    return;
                }
                this.limit=count;

                let newQuery = {};

                Object.assign(newQuery,this.$route.query);
                

                if (count != 5) {
                    newQuery['limit'] = count;
                } else {
                    delete newQuery.limit;
                }
                this.$router.push({ name: 'Favourites', query: newQuery});
            },
            selectTypeChange() {
                let newQuery = {};
                Object.assign(newQuery, this.$route.query);
                if (this.filter_type == "all") {
                    delete newQuery.type;
                } else {
                    newQuery.type = this.filter_type;
                }
                this.$router.push({ name: 'Favourites', query: newQuery});
                console.log(this.filter_type);
            }
        },
        mounted() {
            this.queryToFilters();
            this.getData();
            this.setFiterSelects();
        },
        updated() {
            this.updateData();
        },
        watch: {
            $route() {
                this.queryToFilters();
                this.getData();
                this.setFiterSelects();
            }
        }
    }

</script>

<style lang="less" scoped>
.select-container {
    display:flex;
    gap: 0.2rem;
    align-items: center;
}

.select-filter-order {

    text-align: left;
    @media screen and (max-width: 350px) {
        flex-direction: column;
        justify-content: left;
        .sort-by {
            text-align: left;
            width: 100%;
        }
    }
    @media screen and (max-width: 280px) {
        flex-direction: row;
    }
    @media screen and (max-width: 220px) {
        flex-direction: column;
    }
}
.item-and-paragraph-container {
    margin: 0.8rem 0;
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
    grid-template-columns: 3.5rem  auto;
}

.section-theme-name {
    margin:0 0.4rem;
    display: flex;
}
.icon-section-theme-container {
    display: flex;
    gap: 0.2rem;
}

.emoji-in-paragraph{
    transform:translateY(-2px);
}

.theme_name {
    font-weight: bold;
    padding-top: 0.1rem;
}


.date-time {
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

.btn-panel img {
    width:0.9rem;
    margin:0.1rem;
}

.tools-panel {
    margin: 0.8rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .selects-container{
        display: flex;
        gap: 0.6rem;
        align-items: center;
        flex-wrap: wrap;
    }
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

.section-theme-name a{
    color: white;
    text-decoration: none;
}

.theme-emoji {
    width: 1.8rem;
}
.emoji-link {
    height: 1.8rem;
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
        }
        .theme-image-description-container {
            display: flex;
            width: 100%;
            .theme-image {
                width: 10rem;
            }
            .theme-description {
                border-top: 1px #A298ED solid;
                padding-left: 0.4rem;
                width: 100%;
            }
        }
    }
}
</style>
