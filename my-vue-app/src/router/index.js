import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import Contact from '../pages/Contact.vue';
import NotFound from '../pages/NotFound.vue';
import FAQ from '../pages/FAQ.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/faq', component: FAQ },
    { path: '/:pathMatch(.*)*', component: NotFound } // Catch-all for 404
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;