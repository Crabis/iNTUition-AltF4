import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
// Import Bootstrap and BootstrapVueNext CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

// Optional: Add Bootstrap JS components if needed
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


const app = createApp(App);

// Use BootstrapVueNext
app.use(createBootstrap());

app.use(router);
app.mount('#app');
