<template>
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow p-4">
            <h3 class="text-center mb-4">Login</h3>
  
            <form @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required />
              </div>
  
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  
              <button class="btn btn-primary w-100" type="submit">Login</button>
            </form>
  
            <div class="mt-3 text-center">
              <router-link to="/register">Don't have an account? Register</router-link><br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '@/supabase'
  
  export default {
    name: 'Login',
    setup() {
      const email = ref('')
      const password = ref('')
      const errorMessage = ref('')
      const router = useRouter()
  
      const login = async () => {
        errorMessage.value = ''
        const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  
        if (error) errorMessage.value = error.message
        else router.push('/')
      }
  
      return { email, password, login, errorMessage }
    },
  }
  </script>
  