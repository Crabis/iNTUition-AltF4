<template>
    <div class="text-center">
      <h1 class="display-4">About Page</h1>
      <p class="lead">{{ message }}</p>
      <button class="btn btn-primary" @click="changeMessage">Change Message</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        message: "Learn more about us here."
      };
    },
    methods: {
      changeMessage() {
        this.message = "Thank you for visiting the About page!";
      }
    }
  };
  </script>