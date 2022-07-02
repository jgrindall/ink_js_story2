import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import "./main.scss";
import VueSmoothScroll from 'v-smooth-scroll'

createApp(App)
    .use(createPinia())
    .use(VueSmoothScroll)
    .mount("#app");

