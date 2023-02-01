<template>
        <button class="button"
            v-bind:class="{ active:isActive }" 
            @click="$emit('test')">
        <b><span v-html="content"></span></b>
    </button>
</template>

<script>
export default {
    name: 'PaginateButton',
    props: [
        'content',
        // 'url',
        'isActive'
    ]
}

</script>

<style scoped>
    .button {
        font-size: 0.8rem;
        border: solid white 2px;
        margin: 0 0.3rem;
        background-color: rgb(134, 166, 166,0.0);
        color:white;
        cursor:pointer;
       
    }

    .active {
        box-shadow: 0px 0px 15px rgb(255, 255, 255);
    }
</style>