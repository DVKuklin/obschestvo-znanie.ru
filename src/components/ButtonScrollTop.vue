<template>
    <div v-if="isScrollY" class="button-container">
        <div class="button" @click="handleClick">
            <img class="button-img"
                :src="button_src"
                @mouseover="buttonMouseOver()"
                @mouseleave="buttonMouseLeave()"
                @mousedown="buttonMouseDown()"
                @mouseup="buttonMouseUp()">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ButtonScrollTop',
    props: [

    ],
    data(){
        return {
            button_src: '/myfiles/theme_navigation_buttons/button_left.svg',
            isScrollY: false,
        }
    },
    mounted() {
        window.addEventListener('scroll', this.setIsScrollY)
    },
    methods: {
        setIsScrollY() {
            if (window.scrollY > 0) {
                this.isScrollY = true;
            } else {
                this.isScrollY = false;
            }
        },
        handleClick() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        buttonMouseOver() {
            this.button_src = '/myfiles/theme_navigation_buttons/button_left_hover.svg';
        },
        buttonMouseLeave() {
            this.button_src = '/myfiles/theme_navigation_buttons/button_left.svg';
        },
        buttonMouseDown() {
            this.button_src = '/myfiles/theme_navigation_buttons/button_left_click.svg';
        },
        buttonMouseUp() {
            this.button_src = '/myfiles/theme_navigation_buttons/button_left_hover.svg';
        },
    },
    watch: {

    },
}
</script>

<style lang="less" scoped>
.button-container {
    max-width: 1000px;
    margin: 0 auto;
    height: 20px;
    width: 100%;
    position: fixed;
    bottom: 10px;
    position: fixed;
}
.button {
    font-size: 0.8rem;
    border: solid white 1px;
    background-color: rgba(0,0,0,0.45);
    cursor:pointer;
    position: absolute;
    bottom: 130px;
    right: calc(-1.5625rem - 2*0.5625rem - 1rem);
    padding: 0.5625rem;

    .button-img {
        height: 1.5625rem;
        width: 1.5625rem;
        transform: rotate(90deg);
    }
}
</style>