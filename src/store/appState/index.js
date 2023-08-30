const initialState = { 
    currentThemeName: '',
    currentSectionUrl: '',
    currentSectionName: '',
    isAuthenticated: false,
};

const appState = { 
    namespaced: true,
    state: initialState,
    mutations: { 
        setCurrentThemeName(state, value) {
            state.currentThemeName = value;
        },
        setCurrentSectionUrl(state, value) {
            state.currentSectionUrl = value;
        },
        setCurrentSectionName(state, value) {
            state.currentSectionName = value;
        },
        setIsAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
    },
    // actions: { 
    //     increaseCount({ commit }) {
    //         commit('increaseCount');
    //     },
    // },
    getters: { 
        getCurrentThemeName: (state) => state.currentThemeName,
        getCurrentSectionUrl: (state) => state.currentSectionUrl,
        getCurrentSectionName: (state) => state.currentSectionName,
        getIsAuthenticated: (state) => state.isAuthenticated,
    } 
};

export default appState;