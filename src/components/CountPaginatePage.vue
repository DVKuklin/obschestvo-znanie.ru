<template>
    <div class="countPage-container">
        <span :class="{'active': limit == 5}" @click="$emit('changePageCount',5)">5</span>, 
        <span :class="{'active': limit == 10}" @click="$emit('changePageCount',10)">10</span>, 
        <span :class="{'active': limit == 15}" @click="$emit('changePageCount',15)">15</span>, 
        <span :class="{'active': limit == 'all'}" @click="$emit('changePageCount','all')">Все</span>
    </div>
</template>

<script>
export default {
    name: 'CountPaginatePage',
    props: [
        'limit'
    ],
    data() {
        return {

        }
    },
    created() {

    },
    methods: {

    },
}

</script>

<style lang="less" scoped>
    .countPage-container {
        span {
            cursor: pointer;
        }
        .active {
            text-decoration: underline;
        }
    }

</style>