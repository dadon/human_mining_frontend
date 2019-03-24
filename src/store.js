import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);



export default new Vuex.Store({
    state: {
        userLevel: 0,
    },
    mutations: {
        userLevel(state, level) {
            state.userLevel = level;
        }
    },
    actions: {

    }
});
