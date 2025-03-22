<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">VueApp</a>
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleNavbar"
          aria-controls="navbarNav"
          :aria-expanded="isExpanded"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link></li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/contact">Contact</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/faq">FAQ</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/upload">Start Change</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/emotion">Emotion</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li v-if="user" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Profile
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li><router-link class="dropdown-item" to="/profile">My Profile</router-link></li>
                <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" @click="logout">Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/supabase'

export default {
  name: 'App',
  data() {
    return {
      isExpanded: false
    }
  },
  methods: {
    toggleNavbar() {
      const navbar = document.getElementById('navbarNav');
      let bsCollapse = window.bootstrap.Collapse.getInstance(navbar);
      if (!bsCollapse) {
        // If the Collapse instance is not already created, create one
        bsCollapse = new window.bootstrap.Collapse(navbar, { toggle: false });
      }
      bsCollapse.toggle();
      this.isExpanded = !this.isExpanded;
    }
  },
  setup() {
    const user = ref(null)
    const router = useRouter()
    const route = useRoute()

    const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user || null
    }


    const logout = async () => {
      await supabase.auth.signOut()
      user.value = null
      router.push('/login')
    }

    onMounted(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user || null

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
      if (!session?.user && !['/login', '/register'].includes(route.path)) {
        router.push('/login')
      }
    })
  })

    return { user, logout }
  }
};
</script>

