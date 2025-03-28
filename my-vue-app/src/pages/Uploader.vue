<template>
  <div class="container py-5">
    <div class="card shadow-lg border-0 rounded-lg overflow-hidden">
      <div class="card-header bg-gradient-primary text-white p-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-file-earmark-text fs-2 me-3"></i>
          <h4 class="mb-0">Change Plan Document Analysis</h4>
        </div>
      </div>

      <div class="card-body p-0">
        <!-- Hero section with background image -->
        <div class="position-relative mb-4">
          <div class="hero-banner"
            style="background-image: url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');">
            <div class="hero-overlay p-5">
              <h2 class="text-white mb-3">Transform Your Change Management</h2>
              <p class="text-white-75 mb-4">Upload your document and get AI-powered recommendations tailored to your
                organization's needs</p>
            </div>
          </div>
        </div>

        <div class="p-4 p-lg-5">
          <div class="row g-4">
            <!-- Upload section -->
            <div class="col-lg-6">
              <div class="upload-container p-4 border rounded bg-light text-center position-relative">
                <div class="upload-icon-container mb-3">
                  <i class="bi bi-cloud-arrow-up text-primary"></i>
                </div>
                <h5 class="mb-3">Upload Your Document</h5>
                <p class="text-muted mb-3">Supported formats: PDF, DOCX, TXT</p>

                <div class="d-grid gap-2 col-md-8 mx-auto">
                  <label for="fileUpload" class="btn btn-outline-primary position-relative overflow-hidden">
                    <i class="bi bi-file-earmark me-2"></i>Select File
                    <input id="fileUpload" type="file" @change="handleFileUpload" accept=".txt,.pdf,.docx"
                      class="position-absolute" style="opacity: 0; top: 0; left: 0; width: 100%; height: 100%;" />
                  </label>
                </div>

                <div v-if="selectedFileName" class="mt-3">
                  <div class="file-preview p-2 bg-white rounded border d-flex align-items-center">
                    <i class="bi" :class="fileIcon"></i>
                    <span class="ms-2 text-truncate">{{ selectedFileName }}</span>
                    <span class="badge bg-success ms-auto">Ready</span>
                  </div>
                </div>

                <!-- Decorative elements -->
                <div class="upload-decoration upload-decoration-1"></div>
                <div class="upload-decoration upload-decoration-2"></div>
              </div>
            </div>

            <!-- Prompt section -->
            <div class="col-lg-6">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-sliders me-2"></i>Optimization Preferences</h5>
                </div>
                <div class="card-body">
                  <div class="form-floating mb-3">
                    <textarea v-model="userPrompt" class="form-control" placeholder="Describe your requirements"
                      id="promptTextarea" style="height: 120px"></textarea>
                    <label for="promptTextarea">Describe your change model preferences</label>
                  </div>

                  <div class="text-muted small mb-3">
                    <i class="bi bi-info-circle me-1"></i> Describe how you'd like your change model to be handled
                    (e.g., ADKAR, Lewin, Nudge Theory etc.)
                  </div>

                  <!-- Suggestion chips -->
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="suggestion-chip" @click="addSuggestion('ADKAR Framework')">
                      Use ADKAR
                    </span>
                    <span class="suggestion-chip" @click="addSuggestion('Lewin Theory')">
                      Use Lewin
                    </span>
                    <span class="suggestion-chip" @click="addSuggestion('Nudge Theory')">
                      Nudge Theory
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview section -->
            <div v-if="fileText" class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 class="mb-0"><i class="bi bi-eye me-2"></i>Content Preview</h5>
                  <button class="btn btn-sm btn-outline-secondary" @click="togglePreview">
                    <i class="bi" :class="showPreview ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    {{ showPreview ? 'Hide' : 'Show' }} Preview
                  </button>
                </div>
                <div v-if="showPreview" class="card-body p-0">
                  <div class="p-3 bg-light border-top border-bottom">
                    <div class="d-flex align-items-center mb-2">
                      <div class="preview-stats me-3">
                        <i class="bi bi-file-text me-1"></i> {{ getWordCount() }} words
                      </div>
                      <div class="preview-stats">
                        <i class="bi bi-clock me-1"></i> ~{{ getReadingTime() }} min read
                      </div>
                    </div>
                  </div>
                  <pre class="p-3 mb-0 content-preview">{{ fileText }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Action button -->
          <div class="mt-4 text-center">
            <button :disabled="!fileText || !userPrompt || loading" @click="sendToAPI"
              class="btn btn-lg btn-primary px-5 py-3 action-button">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                aria-hidden="true"></span>
              <i v-else class="bi bi-magic me-2"></i>
              Generate Recommendations
            </button>
          </div>

          <!-- Process visualization -->
          <div v-if="!apiResponse && fileText" class="process-visualization mt-5">
            <div class="process-steps">
              <div class="process-step active">
                <div class="process-icon">
                  <i class="bi bi-1-circle-fill"></i>
                </div>
                <div class="process-text">Upload Document</div>
              </div>
              <div class="process-step" :class="{ active: userPrompt }">
                <div class="process-icon">
                  <i class="bi bi-2-circle"></i>
                </div>
                <div class="process-text">Set Preferences</div>
              </div>
              <div class="process-step" :class="{ active: loading }">
                <div class="process-icon">
                  <i class="bi bi-3-circle"></i>
                </div>
                <div class="process-text">AI Analysis</div>
              </div>
              <div class="process-step" :class="{ active: apiResponse }">
                <div class="process-icon">
                  <i class="bi bi-4-circle"></i>
                </div>
                <div class="process-text">Get Results</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results section -->
      <div v-if="apiResponse" class="card-footer p-0 bg-white">
        <div class="results-container">
          <div class="results-header bg-success bg-gradient text-white p-4">
            <div class="d-flex align-items-center">
              <i class="bi bi-lightbulb fs-2 me-3"></i>
              <h4 class="mb-0">AI Recommendations</h4>
            </div>
          </div>

          <div class="p-4 p-lg-5">
            <div class="card mb-4 border-0 shadow-sm">
              <div class="card-body">
                <div class="recommendations-content" v-html="apiResponse"></div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div class="results-stats">
                <span class="badge bg-light text-dark me-2">
                  <i class="bi bi-clock me-1"></i> Generated in {{ generationTime }}s
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-calendar me-1"></i> {{ currentDate }}
                </span>
              </div>
              <button class="btn btn-sm btn-outline-secondary" @click="saveTimeline">
                     Save Project
                </button>

              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary" @click="downloadPdf">
                  <i class="bi bi-download me-1"></i>Download PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <div v-if="!apiResponse" class="mt-5">
      <h5 class="text-center mb-4">Trusted by Enterprise Teams</h5>
      <div class="row g-4 justify-content-center">
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm testimonial-card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="testimonial-avatar me-3">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Testimonial" />
                </div>
                <div>
                  <h6 class="mb-0">Sarah Johnson</h6>
                  <p class="text-muted small mb-0">Change Manager, Fortune 500</p>
                </div>
              </div>
              <p class="testimonial-text">"This tool transformed our change management process. We reduced
                implementation time by 40% and improved adoption rates."</p>
              <div class="text-warning">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm testimonial-card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="testimonial-avatar me-3">
                  <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Testimonial" />
                </div>
                <div>
                  <h6 class="mb-0">Michael Chen</h6>
                  <p class="text-muted small mb-0">CTO, Tech Innovations Inc.</p>
                </div>
              </div>
              <p class="testimonial-text">"The AI recommendations were spot-on. We successfully migrated our entire
                system with minimal disruption to operations."</p>
              <div class="text-warning">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as mammoth from 'mammoth'
import { marked } from 'marked'
import { getChangePlanRecommendations, getTimeline } from '@/utils/apiService'
import * as pdfjsLib from 'pdfjs-dist'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/supabase'
import { jsPDF } from 'jspdf';

// Use import.meta.url to correctly reference the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href

const fileText = ref('')
const userPrompt = ref('')
const apiResponse = ref('')
const loading = ref(false)
const selectedFileName = ref('')
const showPreview = ref(false)
const fileIcon = ref('bi-file-earmark')
const generationTime = ref('3.2')
const currentDate = ref(new Date().toLocaleDateString())
const aiRecommendationText = ref('')
const aiName = ref('')
const aiTimeline = ref('')
const projectID = ref('')



async function downloadPdf() {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(16);
  doc.text("AI Recommendations", 20, 20);
  
  const recommendations = apiResponse.value.replace(/<[^>]*>/g, '');
  doc.setFontSize(12);
  
  let splitText = doc.splitTextToSize(recommendations, 170);
  let yPosition = 30;
  
  for (let i = 0; i < splitText.length; i++) {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(splitText[i], 20, yPosition);
    yPosition += 7;
  }
  
  doc.save('ai_recommendations.pdf');

  if (!projectID.value) {
  projectID.value = uuidv4()
  }
  const arrayBuffer = doc.output('arraybuffer')
  const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const fileName = `${projectID.value}.pdf`
  console.log(projectID)
  console.log(fileName)
  const { data2, error2 } = await supabase.storage
    .from('plans') // your bucket name
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true // overwrite if same name
    })
    console.log(error2)
}




function togglePreview() {
  showPreview.value = !showPreview.value
}

function getWordCount() {
  return fileText.value ? fileText.value.split(/\s+/).length : 0
}

function getReadingTime() {
  const words = getWordCount()
  return Math.ceil(words / 200) // Assuming 200 words per minute reading speed
}

function addSuggestion(text) {
  if (!userPrompt.value.includes(text)) {
    userPrompt.value = userPrompt.value ? `${userPrompt.value}, ${text.toLowerCase()}` : text
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  selectedFileName.value = file.name

  // Set file icon based on file type
  if (file.name.endsWith('.txt')) {
    fileIcon.value = 'bi-file-earmark-text'
  } else if (file.name.endsWith('.docx')) {
    fileIcon.value = 'bi-file-earmark-word'
  } else if (file.name.endsWith('.pdf')) {
    fileIcon.value = 'bi-file-earmark-pdf'
  }

  const reader = new FileReader()
  loading.value = true

  if (file.name.endsWith('.txt')) {
    reader.onload = () => {
      fileText.value = reader.result
      loading.value = false
    }
    reader.readAsText(file)
  } else if (file.name.endsWith('.docx')) {
    reader.onload = async () => {
      const result = await mammoth.extractRawText({ arrayBuffer: reader.result })
      fileText.value = result.value
      loading.value = false
    }
    reader.readAsArrayBuffer(file)
  } else if (file.name.endsWith('.pdf')) {
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result)
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(item => item.str).join(' ') + '\n'
      }
      fileText.value = text
      loading.value = false
    }
    reader.readAsArrayBuffer(file)
  }
}

async function sendToAPI() {
  loading.value = true
  try {
    const result = await getChangePlanRecommendations(userPrompt.value, fileText.value)
    apiResponse.value = marked(result.rec)
    aiRecommendationText.value = result.rec
    aiName.value = result.context.model.name
    console.log(result.rec)
    console.log(result.context.model.name)
  } catch (err) {
    console.error(err)
    apiResponse.value = '<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>Failed to generate AI recommendations. Please try again later.</div>'
  } finally {
    loading.value = false
  }
}

async function saveTimeline() {
  const projectName = prompt('Enter a Project Name')

  if (!projectName) {
    alert('Project name is required to save.')
    return
  }

  try {
    const response = await getTimeline(aiRecommendationText.value)
    const cleaned = cleanJsonString(response)
    const aiTimelines = JSON.parse(cleaned)
    console.log("Parsed the JSON")
    if (!projectID.value) {
    projectID.value = uuidv4()
    }
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    const userID = session.session.user.id
    const { data, error } = await supabase.from('projectDetails').insert([
      {
        projectID: projectID.value,
        projectName: projectName,
        timeline: aiTimelines, // assuming response is already JSON
        frameworkUsed: aiName.value
      }
    ])
    const { error1 } = await supabase.from('ongoingProjects').insert([
      {
        userID : userID,
        projectID: projectID.value,
        ongoing: true
      }])
    console.log(response)

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(16);
    doc.text("AI Recommendations", 20, 20);
    
    const recommendations = apiResponse.value.replace(/<[^>]*>/g, '');
    doc.setFontSize(12);
    
    let splitText = doc.splitTextToSize(recommendations, 170);
    let yPosition = 30;
  
  for (let i = 0; i < splitText.length; i++) {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(splitText[i], 20, yPosition);
    yPosition += 7;
  }
  const arrayBuffer = doc.output('arraybuffer')
  const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const fileName = `${projectID.value}.pdf`
  console.log(projectID)
  console.log(fileName)
  const { data2, error2 } = await supabase.storage
    .from('plans') // your bucket name
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true // overwrite if same name
    })
  } catch (err) {
    console.error('Error generating timeline or saving:', err)
    alert('❌ An error occurred during save.')
  }
}

function cleanJsonString(rawString) {
  // Remove wrapping ```json and ``` if they exist
  return rawString
    .replace(/^```json\s*/i, '')   // Remove ```json at start
    .replace(/```$/, '')           // Remove trailing ```
    .trim()
}

</script>
<style>
/* Base styles */
body {
  background-color: #f8f9fa;
  color: #212529;
}

/* Hero section */
.hero-banner {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.85), rgba(102, 16, 242, 0.85));
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Card styles */
.card {
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

/* Upload container */
.upload-container {
  border-style: dashed !important;
  border-width: 2px !important;
  border-color: #dee2e6 !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
}

.upload-container:hover {
  border-color: #0d6efd !important;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.upload-icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(13, 110, 253, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.upload-icon-container i {
  font-size: 2rem;
}

/* Decorative elements */
.upload-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  z-index: 0;
}

.upload-decoration-1 {
  width: 100px;
  height: 100px;
  background-color: #0d6efd;
  top: -30px;
  right: -30px;
}

.upload-decoration-2 {
  width: 70px;
  height: 70px;
  background-color: #6610f2;
  bottom: -20px;
  left: -20px;
}

/* File preview */
.file-preview {
  transition: all 0.3s ease;
}

.file-preview:hover {
  background-color: #f8f9fa;
}

.file-preview i {
  font-size: 1.25rem;
}

/* Suggestion chips */
.suggestion-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 2rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
}

.suggestion-chip:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.suggestion-chip i {
  margin-right: 0.5rem;
}

/* Content preview */
.content-preview {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border: none;
  font-size: 0.875rem;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
}

.preview-stats {
  font-size: 0.875rem;
  color: #6c757d;
}

/* Action button */
.action-button {
  transition: all 0.3s ease;
  border-radius: 2rem;
  box-shadow: 0 4px 6px rgba(13, 110, 253, 0.2);
}

.action-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(13, 110, 253, 0.3);
}

.action-button:active:not(:disabled) {
  transform: translateY(0);
}

/* Process visualization */
.process-visualization {
  padding: 2rem 0;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  max-width: 700px;
  margin: 0 auto;
}

.process-steps::before {
  content: '';
  position: absolute;
  top: 25px;
  left: 40px;
  right: 40px;
  height: 2px;
  background-color: #dee2e6;
  z-index: 0;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.process-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  border: 2px solid #dee2e6;
  transition: all 0.3s ease;
}

.process-icon i {
  font-size: 1.5rem;
  color: #6c757d;
}

.process-text {
  font-size: 0.875rem;
  color: #6c757d;
  text-align: center;
}

.process-step.active .process-icon {
  border-color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.1);
}

.process-step.active .process-icon i {
  color: #0d6efd;
}

.process-step.active .process-text {
  color: #0d6efd;
  font-weight: 500;
}

/* Results container */
.results-container {
  border-top: 1px solid #dee2e6;
}

.results-header {
  background: linear-gradient(135deg, #198754, #20c997);
}

.recommendations-content {
  font-size: 1rem;
  line-height: 1.6;
}

.recommendations-content h1,
.recommendations-content h2,
.recommendations-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #212529;
}

.recommendations-content ul,
.recommendations-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.recommendations-content p {
  margin-bottom: 1rem;
}

.results-stats {
  font-size: 0.875rem;
}

/* Testimonials */
.testimonial-card {
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-text {
  font-style: italic;
  color: #495057;
  position: relative;
  padding-left: 1rem;
  border-left: 3px solid #0d6efd;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card,
.upload-container,
.action-button,
.testimonial-card {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .process-steps::before {
    left: 20px;
    right: 20px;
  }

  .process-icon {
    width: 40px;
    height: 40px;
  }

  .process-icon i {
    font-size: 1.25rem;
  }

  .process-text {
    font-size: 0.75rem;
  }

  .hero-banner {
    height: 150px;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #0d6efd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0b5ed7;
}
</style>
