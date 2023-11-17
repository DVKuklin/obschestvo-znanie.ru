<template>
    <div class="button-menu-containter">
        <img v-if="!isOpened" src="/myfiles/button_menu.svg" width="40" class="button-menu" @click="buttonMenuClick" id="buttonTopMenuOpen">
        <img v-if="isOpened" src="/myfiles/button_menu_close.svg" width="40" class="button-menu" @click="buttonMenuClick">
        <div v-if="isOpened" class="menu">
            <div class="top-triangle"></div>
            <img v-if="$store.getters['appState/getIsAuthenticated']" src="/myfiles/login/isLogged.svg" class="menu-button" @:click="isLoginModalOpened = true">
            <img v-if="!$store.getters['appState/getIsAuthenticated']" src="/myfiles/login/isNotLogged.svg" class="menu-button" @:click="isLoginModalOpened = true">
            <RouterLink v-if="$store.getters['appState/getIsAuthenticated']" to="/favourites" @click="isOpened = !isOpened">
                <img src="/myfiles/star.svg" class="menu-button">
            </RouterLink>
            <RouterLink v-for="(item, i) in $store.getters['appState/getAdditionalPages']" :key="i" :to="'/' + item.url">
                <img v-if="item.icon" :src="baseUrlImages + item.icon" class="menu-button">
                <img v-else="item.icon" src="/myfiles/star.svg" class="menu-button">
            </RouterLink>
        </div>
    </div>

    <BaseModal v-if="isLoginModalOpened" v-on:close="isLoginModalOpened = false">
        <div class="heading-logout-container">
            <div class="heading">Авторизация</div>
            <img v-if="$store.getters['appState/getIsAuthenticated']" class="logout-button" src="/myfiles/login/logout-button.svg" @:click="logout">
        </div>
        <div v-if="loginError" class="error-message containers">{{ loginError }}</div>
        <div class="containers input-container">
            <input class="input"
                    type="text"
                    v-model="login" @focus="placeholder_login = false"
                    @blur="inputLoginBlur"
                    id="inputLogin">
            <div v-if="placeholder_login" class="placeholder" @click="inputLoginFocus">
                <img src="/myfiles/login/login.svg" class="placeholder-img">
                <div class="placeholder-text">Логин</div>
            </div>
        </div>
        <div class="containers input-container">
            <input class="input"
                    type="password"
                    v-model="password"
                    @focus="placeholder_password = false"
                    @blur="inputPasswordBlur"
                    @keypress="inputPasswordKeyPress"
                    id="inputPassword">
            <div v-if="placeholder_password" class="placeholder" @click="inputPasswordFocus">
                <img src="/myfiles/login/password.svg" class="placeholder-img">
                <div class="placeholder-text">Пароль</div>
            </div>
        </div>
        <div class="containers">
            <button class="form-button" type="submit" @click="handleLogin">Вход</button>
        </div>
    </BaseModal>

    <BaseModal v-if="loginMessage"
               v-on:close="loginMessage=''">
        {{ loginMessage }}
    </BaseModal>
</template>

<script>
import {baseUrl, baseUrlImages} from '../../../services/config.js';
import BaseModal from '../../../components/BaseModal.vue';
import axios from 'axios';

export default {
    name: 'TopNav',
    components: {BaseModal},
    data() {
        return {
            isOpened: false,
            isLoginModalOpened: false,
            loginError: '',
            login: '',
            password: '',
            placeholder_login: true,
            placeholder_password: true,
            loginMessage: '',
            baseUrlImages: baseUrlImages,
        }
    },
    // props: ['isAuthenticated'],
    created() {
        document.addEventListener('click',(event) => {
            if (event.target.id !== 'buttonTopMenuOpen') {
                this.isOpened = '';
            }
        });
    },
    methods: {
        buttonMenuClick() {
            this.isOpened = !this.isOpened;
        },
        handleLogin() {
            alert('handleLogin');
            this.isLoginModalOpened = true;
        },
        async handleLogin() {
            let errors = [];
            if (this.login==''){
                errors.push('Поле Логин является обязательным.')
            }

            if (this.password==''){
                errors.push('Поле Пароль является обязательным.')
            }
            
            if (errors.length != 0) {
                this.loginError = errors.join(' ');
                return;
            }

            axios.post(baseUrl + '/api/login',{
                name: this.login,
                password: this.password
            })
                .then(response => {
                    if (response.data.status=="success") {
                        localStorage.setItem('token',response.data.token);
                        this.loginMessage = 'Вы успешно авторизованы';

                        //Показываем в меню пункт Избранное
                        this.$store.commit('appState/setIsAuthenticated',true);
                        //Обнуляем поля ввода
                        this.login='';
                        this.placeholder_login=true;
                        this.password='';
                        this.placeholder_password=true;
                        this.isLoginModalOpened=false;
                    } else {
                        this.loginError = response.data.message;
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert('Что то не так. Ошибка: '+ error);
                });
        },
        inputPasswordKeyPress(event) {
            if (event.key=="Enter") {
                this.handleLogin();
            }
        },
        logout() {
            axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
            axios
                .get(baseUrl+'/api/logout')
                .then(response => { 
                    //Убираем из меню пункт Избранное
                    this.$store.commit('appState/setIsAuthenticated',false);
                    if (document.location.pathname == '/favourites') {
                        this.$router.push('/');
                    }
                    this.isLoginModalOpened = false;
                    this.loginMessage = "Вы успешно вышли из аккаунта."
                })
                .catch(error => {
                    console.log('Что то не так. Ошибка: ' + error)
                });
        },
        inputLoginFocus() {
            document.getElementById('inputLogin').focus();
        },
        inputPasswordFocus() {
            document.getElementById('inputPassword').focus();
        },
        inputLoginBlur() {
            if (!this.login) {
                this.placeholder_login = true;
            }
        },
        inputPasswordBlur() {
            if (!this.password) {
                this.placeholder_password = true;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .button-menu-containter {
        position: relative;
    }
    .button-menu {
        cursor: pointer;
        width: 2.5rem;
    }

    .menu {
        position: absolute;
        top: 3rem;
        width: 2.5rem;
        left: -0.45rem;
        display: flex;
        flex-direction: column;
        background-color: rgba(38,39,64,0.39);
        padding: 0.4rem;
        .top-triangle {
            position: absolute;
            top: -0.6rem;
            left: 1rem;
            width: 0;
			height: 0;
			border-left: 0.7rem solid transparent;
			border-right: 0.7rem solid transparent;
			border-bottom: 0.6rem solid rgba(38,39,64,0.39);
        }
        .menu-button {
            width: 2.5rem;
            height: 2.5rem;
            cursor: pointer;
            margin-bottom: 0.4rem;
        }
    }
    .containers {
        margin: 1rem 0 0;
    }
    .heading-logout-container {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        .heading {
            font-size: 1.125rem;
        }
        .logout-button {
            width: 1rem;
            height: 1rem;
            cursor: pointer;
        }
    }
    .error-message {
        color: red;
    }
    .input {
        width: calc(100% - 0.36rem);
        font-size: 1.125rem;
        border-radius: none;
        border: none;
    }
    .input:focus {
        outline: 0;
    }
    .input-container {
        position: relative;
        .placeholder {
            position: absolute;
            top: 0px;
            left: 0px;
            display: flex;
            gap: 0.2rem;
            /* background-color: red; */
            align-items: center;
            .placeholder-img {
                width: 1rem;
                height: 1rem;
            }
            .placeholder-text {
                color: #D9DBDA;
            }
        }
    }
    .form-button {
        color: white;
        font-size: 1.125rem;
        background-color: red;
        border: none;
        cursor: pointer;
        padding: 0.2rem 0.8rem;
    }
</style>