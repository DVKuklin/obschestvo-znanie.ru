<template>
    <div class="breadCrumbs" v-bind:class="{'top-breadCrumbs': position == 'top'}">
        <RouterLink to="/">Главная</RouterLink>
        <img src="/myfiles/button_drop_down.svg" class="arrow">
        <RouterLink v-bind:to="$store.getters['appState/getCurrentSectionUrl']">{{  $store.getters['appState/getCurrentSectionName']  }}</RouterLink>
        <div v-if="position == 'bottom'">{{$store.getters['appState/getCurrentThemeName']}}</div>
    </div>
</template>

<script>
    export default {
        name: "BreadCrumbs",
        props: [
            'position'
        ],
        data() {
            return {

            }
        },
        created() {
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