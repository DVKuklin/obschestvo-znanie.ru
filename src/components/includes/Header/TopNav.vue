<template>
    <div class="button-menu-containter">
        <img v-if="!isOpened" src="/myfiles/button_menu.svg" width="40" class="button-menu" @click="buttonMenuClick" id="buttonTopMenuOpen">
        <img v-if="isOpened" src="/myfiles/button_menu_close.svg" width="40" class="button-menu" @click="buttonMenuClick">
        <div v-if="isOpened" class="menu">
            <div class="top-triangle"></div>
            <img v-if="isAuthenticated" src="/myfiles/login/isLogged.svg" class="menu-button" @:click="isLoginModalOpened = true">
            <img v-if="!isAuthenticated" src="/myfiles/login/isNotLogged.svg" class="menu-button" @:click="isLoginModalOpened = true">
            <RouterLink v-if="isAuthenticated" to="/favourites" @click="isOpened = !isOpened">
                <img src="/myfiles/star.svg" class="menu-button">
            </RouterLink>
        </div>
    </div>

    <div v-if="isLoginModalOpened"
         class="login-modal-container">
        <div class="fade" @click="isLoginModalOpened = false"></div>
        <div class="modal">
            <img src="/myfiles/modal/button-close.svg" class="button-close" @click="isLoginModalOpened = false">
            <div class="heading-logout-container">
                <div class="heading">Авторизация</div>
                <img v-if="isAuthenticated" class="logout-button" src="/myfiles/login/logout-button.svg" @:click="logout">
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
                       id="inputPassword">
                <div v-if="placeholder_password" class="placeholder" @click="inputPasswordFocus">
                    <img src="/myfiles/login/password.svg" class="placeholder-img">
                    <div class="placeholder-text">Пароль</div>
                </div>
            </div>
            <div class="containers">
                <button class="form-button" @click="handleLogin">Вход</button>
            </div>

        </div>
    </div>
</template>

<script>
import {baseUrl} from '../../../services/config.js';
import axios from 'axios';

export default {
    name: 'TopNav',
    data() {
        return {
            isOpened: false,
            isLoginModalOpened: false,
            loginError: '',
            login: '',
            password: '',
            placeholder_login: true,
            placeholder_password: true,
        }
    },
    props: ['isAuthenticated'],
    created() {
        document.addEventListener('click',(event) => {
            console.log(event.target.id);
            if (event.target.id !== 'buttonTopMenuOpen') {
                this.isOpened = false;
            }
        })
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
                        // console.log("success");
                        // console.log(response.data.token);
                        localStorage.setItem('token',response.data.token);
                        alert('Вы успешно авторизованы');
                        // this.isLogin = true;
                        // this.userName = response.data.user_name;

                        //Показываем в меню пункт Избранное
                        this.$emit('authenticate');
                        location.reload();
                        //Обнуляем поля ввода
                        this.login='';
                        this.placeholder_login=true;
                        this.password='';
                        this.placeholder_password=true;
                    } else {
                        this.loginError = response.data.message;
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert('Что то не так. Ошибка: '+ error);
                });
        },
        logout() {
            axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
            axios
                .get(baseUrl+'/api/logout')
                .then(response => { 
                    console.log(response);
                    // this.isLogin = false;

                    //Убираем из меню пункт Избранное
                    this.$emit('notAuthenticate');
                    location.reload();
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
    .login-modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        .fade {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.45);
        }
        .modal {
            display: flex;
            flex-direction: column;
            background-color: #0000D5;
            padding: 1rem;
            position: relative;
            border: solid white 1px;
            width: 214px;
            .button-close {
                position: absolute;
                top: 0.4rem;
                right: 0.4rem;
                cursor: pointer;
                width: 0.5rem;
                height: 0.5rem;
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
        }
    }
</style>