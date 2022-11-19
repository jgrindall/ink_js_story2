import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import "./main.scss";
import 'vant/lib/index.css';
import { Icon, Button, NavBar } from 'vant';
import { ConfigProvider } from 'vant';
import { Loading } from 'vant';

const app = createApp(App)

app
    .use(Button)
    .use(NavBar)
    .use(ConfigProvider)
    .use(Loading)
    .use(Icon)
    .use(createPinia())
    .use(router)
    .mount('#app')
