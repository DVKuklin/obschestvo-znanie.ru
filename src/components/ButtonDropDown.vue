<template>
    <div :class="aditionClass + ' container'" :id="button_id">
        <img class="button" 
            src="/myfiles/button_drop_down.svg"
            @click="handleClick"
            v-bind:class="{ 'is-pressed': isPressed }">
    </div>
</template>

<script>
export default {
    name: 'ButtonDropDown',
    props: [
        'parameter',
        'button_id',
        'className',
        'pressed',
    ],
    data() {
        return {
            isPressed: this.pressed && false,
            aditionClass: '',
        }
    },
    created() {
        if (!this.className) {
            this.aditionClass = '';
        } else {
            this.aditionClass = this.className;
        }
    },
    methods: {
        handleClick() {
            if (this.isPressed) {
                this.isPressed = false;
            } else {
                this.isPressed = true;
            }
            this.$emit('themeDropDownClick',this.parameter)
        },
    },
    watch: {
        pressed: function() {
            this.isPressed = this.pressed;
        }
    },
}

</script>

<style scoped>
    .button {
        cursor:pointer;
        width: 0.8rem;
        height: 0.8rem;
        transition: 500ms;
    }

    .is-pressed {
        transform: rotate(90deg);
    }
    .container {
        width: 1.8rem;
        height: 1.8rem;
        display:flex;
        justify-content: center;
        align-items: center;
    }
</style>