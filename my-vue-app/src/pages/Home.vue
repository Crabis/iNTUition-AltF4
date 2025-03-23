<template>
  <div class="dashboard-container bg-light min-vh-100">
    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-diagram-3-fill me-2"></i>
          Change Manager Roadmaps
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
<!-- Sidebar -->
<div class="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse shadow-sm" id="sidebarMenu">
  <div class="position-sticky pt-3">
    <!-- Ongoing Projects Section -->
    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
      <span>Ongoing Projects</span>
      <a class="link-secondary" href="#" aria-label="Add a new project">
        <i class="bi bi-plus-circle"></i>
      </a>
    </h6>
    <ul class="nav flex-column">
      <li class="nav-item" v-for="(dataset, index) in ongoingProjects" :key="index">
        <div class="d-flex align-items-center">
          <a class="nav-link d-flex align-items-center flex-grow-1"
            :class="{ 'active bg-primary text-white': selectedProjectIndex === getOriginalIndex(dataset) }" href="#"
            @click.prevent="selectProject(getOriginalIndex(dataset))">
            <i class="bi bi-kanban me-2"></i>
            {{ dataset.title }}
            <span v-if="selectedProjectIndex === getOriginalIndex(dataset)" class="ms-auto">
              <i class="bi bi-check-circle-fill"></i>
            </span>
          </a>
        </div>
      </li>
    </ul>
    
    <!-- Past Projects Section -->
    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
      <span>Past Projects</span>
    </h6>
    <ul class="nav flex-column">
      <li class="nav-item" v-for="(dataset, index) in pastProjects" :key="index">
        <div class="d-flex align-items-center">
          <a class="nav-link d-flex align-items-center flex-grow-1"
            :class="{ 'active bg-primary text-white': selectedProjectIndex === getOriginalIndex(dataset) }" href="#"
            @click.prevent="selectProject(getOriginalIndex(dataset))">
            <i class="bi bi-archive me-2"></i>
            {{ dataset.title }}
            <span v-if="selectedProjectIndex === getOriginalIndex(dataset)" class="ms-auto">
              <i class="bi bi-check-circle-fill"></i>
            </span>
          </a>
        </div>
      </li>
    </ul>
  </div>
</div>


        <!-- Main Content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ selectedProject ? selectedProject.title : 'Dashboard' }}</h1>
    
    <!-- Project Status Toggle Button -->
    <div v-if="selectedProject" class="btn-toolbar">
      <button v-if="selectedProject.ongoing" 
              class="btn btn-outline-secondary" 
              @click="updateProjectStatus(selectedProject, false)">
        <i class="bi bi-check-circle me-1"></i> Mark as Completed
      </button>
      <button v-else 
              class="btn btn-outline-primary" 
              @click="updateProjectStatus(selectedProject, true)">
        <i class="bi bi-arrow-counterclockwise me-1"></i> Reactivate Project
      </button>
      <button class="btn btn-outline-info" 
              @click="viewProjectPDF(selectedProject.projectID)">
        <i class="bi bi-file-earmark-pdf me-1"></i> View PDF
      </button>
    </div>
  </div>



          <!-- Project Timeline -->
          <div v-if="selectedProject" class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Timeline</h5>
            </div>
            <div class="card-body">
              <!-- Bootstrap Timeline Component -->
              <section class="bsb-timeline-7 py-3">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <ul class="timeline">
                        <li v-for="(item, itemIndex) in selectedProject.items" :key="itemIndex" class="timeline-item">
                          <div class="timeline-body">
                            <div class="timeline-meta">
                              <div
                                class="d-inline-flex flex-column px-3 py-2 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3 text-md-end">
                                <span class="fw-bold">{{ item.date || 'No Date' }}</span>
                                <span v-if="item.subdate" class="text-muted small">{{ item.subdate }}</span>
                              </div>
                            </div>
                            <div class="timeline-content timeline-indicator">
                              <div class="card border-0 shadow-sm">
                                <div class="card-body p-4">
                                  <h4 class="card-title mb-2">{{ item.title }}</h4>
                                  <h6 v-if="item.subtitle" class="card-subtitle text-muted mb-3">{{ item.subtitle }}
                                  </h6>
                                  <p class="card-text">{{ item.description }}</p>
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

          <!-- Placeholder when no project is selected -->
          <div v-else class="text-center my-5 py-5">
            <div class="display-1 text-muted mb-4">
              <i class="bi bi-kanban"></i>
            </div>
            <h3 class="text-muted">Select a project to view its timeline</h3>
            <p class="text-muted">Choose from the projects list on the left sidebar</p>
            <button class="btn btn-primary mt-3">
              <i class="bi bi-plus-circle me-2"></i> Create New Project
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase';
export default {
  name: 'Home',
  data() {
    return {
      roadmapData: [],
      selectedProjectIndex: 0
    }
  },
  computed: {
    selectedProject() {
      return this.roadmapData[this.selectedProjectIndex];
    },
    ongoingProjects() {
    return this.roadmapData.filter(project => project.ongoing === true);
  },
  pastProjects() {
    return this.roadmapData.filter(project => project.ongoing === false);
  }
  },
  methods: {
    async viewProjectPDF(projectID) {
    try {
      const { data, error } = await supabase
        .storage
        .from('plans')
        .createSignedUrl(`${projectID}.pdf`, 60); // URL valid for 60 seconds

      if (error) {
        console.error('Error fetching PDF URL:', error);
        return;
      }

      if (data) {
        window.open(data.signedUrl, '_blank');
      } else {
        console.error('PDF not found for project ID:', projectID);
      }
    } catch (error) {
      console.error('Error in viewProjectPDF:', error);
    }
  },
    async updateProjectStatus(project, ongoingStatus) {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      // Find the project in the roadmapData array to get its projectID
      const projectIndex = this.getOriginalIndex(project);
      const projectToUpdate = this.roadmapData[projectIndex];
      
      // Update the project status in Supabase
      const { error } = await supabase
        .from('ongoingProjects')
        .update({ ongoing: ongoingStatus })
        .eq('projectID', projectToUpdate.projectID)
      
      if (error) {
        console.error('Error updating project status:', error);
        return;
      }
      
      // Update the local state
      this.roadmapData[projectIndex].ongoing = ongoingStatus;
      
      // Show success message (you can implement a toast notification here)
      console.log(`Project "${project.title}" has been ${ongoingStatus ? 'reactivated' : 'marked as complete'}`);
    } catch (error) {
      console.error('Error in updateProjectStatus:', error);
    }
  },
    getOriginalIndex(project) {
    return this.roadmapData.findIndex(p => p.title === project.title);
  },
    handleRoadmapGenerated(roadmap) {
      this.roadmapData = roadmap;
      this.selectedProjectIndex = 0;
    },
    selectProject(index) {
      this.selectedProjectIndex = index;
    },
    async fetchData() {
      const { data: { user } } = await supabase.auth.getUser();

      // Assuming ongoingProjects has a user_id column that references the authenticated user
      const { data, error } = await supabase
        .from('ongoingProjects')
        .select(`projectID,ongoing,
    projectDetails (projectName,timeline)
  `)
        .eq('userID', user.id); // Use the appropriate column that links to the user

      if (error) console.error('Error fetching data:', error);
      else { console.log(data); 
      for(let i of data){
        let response =i.projectDetails.timeline
        response.title = i.projectDetails.projectName
        response.ongoing = i.ongoing
        response.projectID = i.projectID
        this.roadmapData.push(response)
        console.log(response)
      }
      }

      
    }

  },
  mounted() {
    this.fetchData();
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
  background-color: #0d6efd;
  z-index: 1;
}

/* Sidebar Styles */
.sidebar {

  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
  padding: .75rem 1rem;
  border-radius: .25rem;
  margin: .2rem .5rem;
}

.sidebar .nav-link:hover {
  background-color: rgba(13, 110, 253, 0.1);
}

.sidebar .nav-link.active {
  color: #fff;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .sidebar {
    position: static;
    height: auto;
    padding-top: 0;
  }

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
