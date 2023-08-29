<template>
    <div v-if="status == 'notAuth'" class = "message">
        Для Вас контент данной страницы недоступен. Если Вы не авторизованы, пожалуйста авторизутесь.
    </div>
    <div v-if="status == 'notAllowed'" class = "message">
        Для Вас контент данной страницы недоступен.
    </div>
    <div v-if="status == 'notFound'" class = "message">
        Страница не найдена.
    </div>
</template>

<script>
    export default {
        name: "StatusMessage",
        props: ['status']
    }
</script>

<style scoped>
    .message a {
        color:rgb(163,239,239);
    }

    .message a:visited {
        color:rgb(163,239,239);
    }

    .message {
        max-width:400px;
        margin-left:auto;
        margin-right:auto;
        text-align:center;
        margin-top:30px;
        margin-bottom:30px;
    }
</style>