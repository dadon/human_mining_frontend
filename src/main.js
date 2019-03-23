import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Misc from "./utils/Misc";

Vue.config.productionTip = false;


Vue.mixin({
    methods: {
        ...Misc,
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
