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
      <div v-if="!roadmapData || roadmapData.length === 0" class="mt-8 text-center text-gray-500">
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          No roadmap available. Please upload a file or submit a proposed change first.
        </div>
      </div>

      <!-- Display the roadmap once we have data -->
      <div v-else class="mt-8">
        <div v-for="(dataset, index) in roadmapData" :key="index" class="mb-5">
          <h3 class="text-xl font-bold mb-3" v-if="dataset.title">{{ dataset.title }}</h3>
          
          <!-- Bootstrap Timeline Component -->
          <section class="bsb-timeline-7 py-3">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-12">
                  <ul class="timeline">
                    <li v-for="(item, itemIndex) in dataset.items" :key="itemIndex" class="timeline-item">
                      <div class="timeline-body">
                        <div class="timeline-meta">
                          <div class="d-inline-flex flex-column px-2 py-1 text-success-emphasis bg-success-subtle border border-success-subtle rounded-2 text-md-end">
                            <span class="fw-bold">{{ item.date || 'No Date' }}</span>
                            <span v-if="item.subdate">{{ item.subdate }}</span>
                          </div>
                        </div>
                        <div class="timeline-content timeline-indicator">
                          <div class="card border-0 shadow">
                            <div class="card-body p-xl-4">
                              <h2 class="card-title mb-2">{{ item.title }}</h2>
                              <h6 v-if="item.subtitle" class="card-subtitle text-secondary mb-3">{{ item.subtitle }}</h6>
                              <p class="card-text m-0">{{ item.description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      roadmapData: [
  {
    title: "Project Alpha Roadmap",
    items: [
      {
        date: "2025 - Present",
        subdate: "Phase 3",
        title: "Market Expansion",
        subtitle: "Global Rollout",
        description: "Expanding to international markets with localized features."
      },
      {
        date: "2024 - 2025",
        subdate: "Phase 2",
        title: "Feature Enhancement",
        subtitle: "Version 2.0",
        description: "Adding advanced features based on user feedback."
      }
      // More items...
    ]
  },
  // More datasets...
]
    }
  },
  methods: {
    handleRoadmapGenerated(roadmap) {
      // Store the roadmap data once it's received from the Uploader
      this.roadmapData = roadmap;
    }
  }
}
</script>

<style>
/* Bootstrap Timeline Styles */
.bsb-timeline-7 .timeline {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
}

.bsb-timeline-7 .timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  margin-left: -1px;
  background-color: #dee2e6;
}

.bsb-timeline-7 .timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.bsb-timeline-7 .timeline-body {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bsb-timeline-7 .timeline-meta {
  flex: 0 0 40%;
  max-width: 40%;
  padding-right: 2rem;
  text-align: right;
}

.bsb-timeline-7 .timeline-content {
  flex: 0 0 60%;
  max-width: 60%;
  padding-left: 2rem;
  position: relative;
}

.bsb-timeline-7 .timeline-indicator::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #198754;
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .bsb-timeline-7 .timeline::before {
    left: 1rem;
  }
  
  .bsb-timeline-7 .timeline-body {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .bsb-timeline-7 .timeline-meta,
  .bsb-timeline-7 .timeline-content {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 0;
    text-align: left;
  }
  
  .bsb-timeline-7 .timeline-meta {
    margin-bottom: 0.5rem;
  }
  
  .bsb-timeline-7 .timeline-indicator::before {
    left: -2rem;
    top: 0.75rem;
  }
}
</style>
