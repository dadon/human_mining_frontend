import Vue from "vue";
import Router from "vue-router";
import MainPage from "./views/MainPage";

Vue.use(Router);

export default new Router({
    base: process.env.BASE_URL,

    routes: [
        {
            path: "/",
            name: "main",
            component: MainPage
        },

        {
            path: "/lvl/:address",
            name: "level",
            component: MainPage
        }
    ]
});
