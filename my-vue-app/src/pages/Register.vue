<template>
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow p-4">
            <h3 class="text-center mb-4">Register</h3>
  
            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input type="password" class="form-control" v-model="confirmPassword" required />
              </div>
  
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  
              <button class="btn btn-success w-100" type="submit">Sign Up</button>
            </form>
  
            <div class="mt-3 text-center">
              <router-link to="/login">Already have an account? Login</router-link>
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
    name: 'Register',
    setup() {
      const email = ref('')
      const password = ref('')
      const confirmPassword = ref('')
      const errorMessage = ref('')
      const router = useRouter()
  
      const register = async () => {
        errorMessage.value = ''
        if (password.value !== confirmPassword.value) {
          errorMessage.value = 'Passwords do not match.'
          return
        }
  
        const { error } = await supabase.auth.signUp({ email: email.value, password: password.value })
  
        if (error) errorMessage.value = error.message
        else router.push('/')
      }
  
      return { email, password, confirmPassword, register, errorMessage }
    },
  }
  </script>
  