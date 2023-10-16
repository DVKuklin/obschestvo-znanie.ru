import { createStore } from 'vuex';
import appState from './appState';

export default createStore({ 
    modules: { 
        appState
    } 
});