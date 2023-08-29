<template>
    <div class="breadCrumbs" v-bind:class="{'top-breadCrumbs': position == 'top'}">
        <RouterLink to="/">Главная</RouterLink>
        <img src="/myfiles/button_drop_down.svg" class="arrow">
        <RouterLink v-bind:to="sectionURL">{{sectionName}}</RouterLink>
        <div v-if="position == 'bottom'">{{themeName}}</div>
    </div>
</template>

<script>
    import axios from "axios";
    import {baseUrl} from '../services/config.js';

    export default {
        name: "BreadCrumbs",
        props: [
            'position'
        ],
        data() {
            return {
                isDataLoad: false,
                sectionURL: '',
                sectionName: '',
                themeName: ''
            }
        },
        created() {
            let str = this.$route.path.slice(1,this.$route.path.length);
            let urls = str.split("/");

            let data={
                section_url: urls[0],
                theme_url: urls[1]
            }

            axios.post(baseUrl+'/api/get_section_name_and_theme_name_by_url',data)
                .then(response => {
                    if (response.data.status = "success") {
                        this.isDataLoad = true;
                        this.sectionName = response.data.section_name;
                        this.themeName = response.data.theme_name;
                        this.sectionURL = '/'+urls[0];
                    }
                })
                .catch(error => {
                    console.log("Ошибка :"+error)
                });
        }
    }
</script>

<style lang="less" scoped>
    .breadCrumbs {
        margin-bottom: 5px;
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
        width: fit-content;
        padding: 0 0.2rem;
        .arrow {
            width: 0.8rem;
            height: 0.8rem;
        }
    }
    .top-breadCrumbs {
        background-color: rgba(96,93,207,0.46);
    }
    a {
        color: white;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
    }
    .breadCrumbs a:visited {
        color: white;
    }
</style>