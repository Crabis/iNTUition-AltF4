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
          <div class="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse shadow-sm" id="sidebarMenu">
            <div class="position-sticky pt-3">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Projects</span>
                <a class="link-secondary" href="#" aria-label="Add a new project">
                  <i class="bi bi-plus-circle"></i>
                </a>
              </h6>
              <ul class="nav flex-column">
                <li class="nav-item" v-for="(dataset, index) in roadmapData" :key="index">
                  <a class="nav-link d-flex align-items-center" 
                     :class="{ 'active bg-primary text-white': selectedProjectIndex === index }"
                     href="#" 
                     @click.prevent="selectProject(index)">
                    <i class="bi bi-kanban me-2"></i>
                    {{ dataset.title }}
                    <span v-if="selectedProjectIndex === index" class="ms-auto">
                      <i class="bi bi-check-circle-fill"></i>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Main Content -->
          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 class="h2">{{ selectedProject ? selectedProject.title : 'Dashboard' }}</h1>
  
            </div>
  
  
  
            <!-- Project Timeline -->
            <div v-if="selectedProject" class="card shadow-sm">
              <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Timeline</h5>
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                    <i class="bi bi-filter"></i> Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" href="#">All Phases</a></li>
                    <li><a class="dropdown-item" href="#">Current Phase</a></li>
                    <li><a class="dropdown-item" href="#">Upcoming Phases</a></li>
                  </ul>
                </div>
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
                                <div class="d-inline-flex flex-column px-3 py-2 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3 text-md-end">
                                  <span class="fw-bold">{{ item.date || 'No Date' }}</span>
                                  <span v-if="item.subdate" class="text-muted small">{{ item.subdate }}</span>
                                </div>
                              </div>
                              <div class="timeline-content timeline-indicator">
                                <div class="card border-0 shadow-sm">
                                  <div class="card-body p-4">
                                    <h4 class="card-title mb-2">{{ item.title }}</h4>
                                    <h6 v-if="item.subtitle" class="card-subtitle text-muted mb-3">{{ item.subtitle }}</h6>
                                    <p class="card-text">{{ item.description }}</p>
                                    <div class="d-flex justify-content-end mt-3">
                                      <button class="btn btn-sm btn-outline-primary me-2">
                                        <i class="bi bi-pencil"></i> Edit
                                      </button>
                                      <button class="btn btn-sm btn-outline-secondary">
                                        <i class="bi bi-three-dots"></i> More
                                      </button>
                                    </div>
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
        },
        {
          date: "2023 - 2024",
          subdate: "Phase 1",
          title: "Initial Launch",
          subtitle: "Version 1.0",
          description: "Core functionality release with essential features."
        }
      ]
    },
    {
      title: "DevOps Implementation Roadmap",
      items: [
        {
          date: "Q3 2025",
          subdate: "Final Phase",
          title: "Continuous Optimization",
          subtitle: "Performance Tuning",
          description: "Refining processes and enhancing monitoring systems."
        },
        {
          date: "Q2 2025",
          subdate: "Phase 2",
          title: "Pipeline Automation",
          subtitle: "CI/CD Implementation",
          description: "Establishing automated testing and deployment workflows."
        },
        {
          date: "Q1 2025",
          subdate: "Phase 1",
          title: "Infrastructure Setup",
          subtitle: "Foundation Building",
          description: "Implementing core DevOps tools and establishing best practices."
        }
      ]
    },
    {
      title: "Product Marketing Roadmap",
      items: [
        {
          date: "Q4 2025",
          subdate: "Growth Phase",
          title: "Loyalty Program",
          subtitle: "Customer Retention",
          description: "Launching rewards system to increase customer lifetime value."
        },
        {
          date: "Q3 2025",
          subdate: "Expansion Phase",
          title: "Channel Diversification",
          subtitle: "Multi-platform Strategy",
          description: "Expanding marketing efforts to new platforms and partnerships."
        },
        {
          date: "Q2 2025",
          subdate: "Launch Phase",
          title: "Market Penetration",
          subtitle: "Initial Campaigns",
          description: "Executing targeted campaigns to establish market presence."
        }
      ]
    },
    {
      title: "IT Transformation Roadmap",
      items: [
        {
          date: "2026",
          subdate: "Innovation Phase",
          title: "AI Integration",
          subtitle: "Smart Systems",
          description: "Implementing machine learning solutions across departments."
        },
        {
          date: "2025",
          subdate: "Modernization Phase",
          title: "Cloud Migration",
          subtitle: "Infrastructure Upgrade",
          description: "Moving legacy systems to cloud-based architecture."
        },
        {
          date: "2024",
          subdate: "Assessment Phase",
          title: "System Audit",
          subtitle: "Gap Analysis",
          description: "Evaluating current systems and identifying improvement opportunities."
        }
      ]
    },
    {
      title: "Agile Implementation Roadmap",
      items: [
        {
          date: "Q4 2025",
          subdate: "Optimization",
          title: "Continuous Improvement",
          subtitle: "Metrics & Refinement",
          description: "Establishing KPIs and refining agile practices based on team feedback."
        },
        {
          date: "Q3 2025",
          subdate: "Scaling",
          title: "Cross-team Coordination",
          subtitle: "Enterprise Adoption",
          description: "Expanding agile methodologies across multiple departments."
        },
        {
          date: "Q2 2025",
          subdate: "Implementation",
          title: "Team Transition",
          subtitle: "Sprint Adoption",
          description: "Transitioning pilot teams to scrum framework and sprint cycles."
        }
      ]
    }
  ],
        selectedProjectIndex: 0
      }
    },
    computed: {
      selectedProject() {
        return this.roadmapData[this.selectedProjectIndex];
      }
    },
    methods: {
      handleRoadmapGenerated(roadmap) {
        this.roadmapData = roadmap;
        this.selectedProjectIndex = 0;
      },
      selectProject(index) {
        this.selectedProjectIndex = index;
      }
    }
  }
  </script>