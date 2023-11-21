<template>
    <div class="heading">
        <img class="heading-star" :src="icon">
        <h1>{{ title }}</h1>
    </div>
    <div v-for="(item, i) in contents" :key="i" v-html="item.content" class="paragraph" :class="{'even': (i%2!=0)}"></div>  
</template>

<script>
    import axios from 'axios';
    import {baseUrl, baseUrlImages} from '../services/config.js';

    export default {
        name: 'AdditionalPage',
        data() {
            return {
                title: '',
                contents: [],
                icon: '',
            }
        },
        async created() {
            this.getData();
        },
        methods: {
            getData() {
                this.title='';
                this.contents='';
                this.icon='';
                let str = this.$route.path.slice(1,this.$route.path.length);
                let urls = str.split("/");
                let url = urls[0];
                axios
                .get(baseUrl+'/api/get_additional_page_by_url?url='+url)
                .then(response => {
                    this.title=response.data.page.title;
                    this.contents=response.data.contents;
                    this.icon=baseUrlImages+response.data.page.icon;
                    console.log(response);
                })
                .catch(error => {
                    console.log(error.response);
                });
            },
        },
        watch: {
            $route (to, from){
                this.getData();
            }
        }
    }
</script>

<style lang="less" scoped>
.heading {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    margin-top: 0.5rem;
    .heading-star {
        height: 1.5rem;
    }
    h1 {
        font-size: 1.5rem;
        margin:0;
    }
}
.paragraph {
    background-color: #040085;
    padding: 0.2rem 0.5rem;
    margin: 0.7rem 0;
}
.even {
    background-color: #010CD3;
}
</style>