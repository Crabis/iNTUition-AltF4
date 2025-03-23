import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import NotFound from '../pages/NotFound.vue';
import FAQ from '../pages/FAQ.vue';
import Uploader from '../pages/Uploader.vue'
import Emotion from '../pages/Emotion.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/faq', component: FAQ },
    { path: '/upload', component: Uploader },
    { path: '/emotion', component: Emotion },
    { path: '/register', name: 'Register', component: Register },
    { path: '/:pathMatch(.*)*', component: NotFound } // Catch-all for 404
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;