<template>
    <div class="topLog">
        <RouterLink to="/">
            <nobr class="topLogo-container">
                <img src="/myfiles/logoWhite.png"> 
                <div class = "logURL">
                    <b>ОБЩЕСТВОЗНАНИЕ</b>
                    <br>
                    <span class = "under">Курс по подготовке к экзаменам</span>
                    <br>
                    <span class = "under">и повышению успеваемости</span>
                </div>
            </nobr>
        </RouterLink>
    </div>
</template>

<script>
    export default {
        name: "TopLogo"
    }
</script>

<style scoped>
    .topLog {
        font-size:1.4rem;
        text-align:left;
        flex-basis: content;
    }

    img {
        width:6.7rem;
        margin-right: 0.2rem;
    }

    .topLog a {
        color:white;
        text-decoration:none;
    }

    .topLog .logURL {
        display:inline-block;
        position:relative;
        bottom:1.1rem;
        line-height:0.8;
    }

    .topLog .logURL .under {
        font-size:1rem;
    }

    .topLog img {
        background:red;
    }
</style>