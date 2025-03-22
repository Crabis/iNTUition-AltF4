<template>
  <!-- Full-height container with a light gray background -->
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <!-- Centered card -->
    <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <!-- Main Title -->
      <h1 class="text-3xl font-bold mb-6 text-center">
        Change Manager Roadmaps
      </h1>
      
      <!-- Uploader Component -->
      <Uploader @roadmapGenerated="handleRoadmapGenerated" />

      <!-- If no roadmap yet, show a placeholder message -->
      <div v-if="!roadmapData" class="mt-8 text-center text-gray-500">
        <p>No roadmap available. Please upload a file to generate one.</p>
      </div>

      <!-- Display the roadmap once we have data -->
      <div v-else class="mt-8">
        <Roadmap :data="roadmapData" />
      </div>
    </div>
  </div>
</template>

<script>
import Roadmap from '@/components/Roadmap.vue'

export default {
  name: 'Home',
  components: {
    Roadmap
  },
  data() {
    return {
      roadmapData: null
    }
  },
  methods: {
    handleRoadmapGenerated(roadmap) {
      // Store the roadmap data once it's received from the Uploader
      this.roadmapData = roadmap
    }
  }
}
</script>

<style scoped>
/* You can add or adjust additional styles here as needed */
</style>
