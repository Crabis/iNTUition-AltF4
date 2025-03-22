<template>
    <div class="text-center">
      <h1 class="display-4">About Page</h1>
      <p class="lead">{{ message }}</p>
      <button class="btn btn-primary" @click="changeMessage">Change Message</button>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'; // Import the Supabase client
  
  export default {
    data() {
      return {
        message: "Learn more about us here."
      };
    },
    methods: {
      changeMessage() {
        this.message = "Thank you for visiting the About page!";
      },
      // Example method using Supabase
      async fetchData() {
        const { data, error } = await supabase
          .from('your_table')
          .select('*');
        
        if (error) console.error('Error fetching data:', error);
        else console.log('Data:', data);
      }
    },
    mounted() {
      // You can call Supabase methods when component mounts
      this.fetchData();
    }
  };
  </script>
  