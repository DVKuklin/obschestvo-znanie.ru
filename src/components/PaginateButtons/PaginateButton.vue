<template>
    <button v-if="!page" class="button"
        v-bind:class="{ active:isActive }">
        <b><span v-html="content"></span></b>
    </button>
    <RouterLink v-else :to="{ name: 'Favourites', query: newQuery }">
        <button class="button"
            v-bind:class="{ active:isActive }">
            <span v-html="content"></span>
        </button>
    </RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'PaginateButton',
    props: [
        'content',
        'page',
        'isActive',
        'query'
    ],
    data() {
        return {
            newQuery: {},
        }
    },
    components: { RouterLink },
    mounted() {
        Object.assign(this.newQuery,this.query);
        if (this.content != 1 && this.page !== null) {
            Object.assign(this.newQuery, {page: this.page})
        }
    },
    watch: {
        query: function() {
            this.newQuery = {};
            Object.assign(this.newQuery,this.query);
            if (this.content != 1 && this.page !== null && this.content != '1') {
                Object.assign(this.newQuery, {page: this.page})
            }
        }
    }
}

</script>

<style scoped>
    .button {
        font-size: 0.8rem;
        border: solid white 1px;
        margin: 0 0.3rem;
        background-color: rgb(134, 166, 166,0.0);
        color:white;
        cursor:pointer;
        font-family: 'Open Sans', sans-serif;
    }

    .active {
        box-shadow: 0px 0px 10px rgb(255, 255, 255);
        background-color:rgb(0,0,0, 0.45);
    }
</style>