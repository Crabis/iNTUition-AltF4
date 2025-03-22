<template>
    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Upload Change Plan Document</h1>
  
      <input type="file" @change="handleFileUpload" accept=".txt,.pdf,.docx" class="mb-4" />
  
      <textarea
        v-model="userPrompt"
        placeholder="Describe how you'd like your change model to be handled (e.g., focus on agility, minimize disruption, etc.)"
        rows="4"
        class="w-full p-2 mb-4 border rounded"
      ></textarea>
  
      <div v-if="loading" class="text-blue-500">Processing file...</div>
  
      <div v-if="fileText" class="mb-4">
        <h2 class="text-lg font-semibold">Extracted Content Preview:</h2>
        <pre class="p-2 bg-gray-100 border rounded max-h-60 overflow-y-auto whitespace-pre-wrap">{{ fileText }}</pre>
      </div>
  
      <button
        :disabled="!fileText || !userPrompt || loading"
        @click="sendToAPI"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Get Recommendations
      </button>
  
      <div v-if="apiResponse" class="mt-6">
        <h2 class="text-lg font-semibold">AI Recommendations:</h2>
        <pre class="p-2 bg-green-100 border rounded whitespace-pre-wrap">{{ apiResponse }}</pre>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import * as mammoth from 'mammoth'
  import * as pdfjsLib from 'pdfjs-dist'
  import { getChangePlanRecommendations } from '@/utils/apiService'
  
  const fileText = ref('')
  const userPrompt = ref('')
  const apiResponse = ref('')
  const loading = ref(false)
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  
  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
  
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
      apiResponse.value = result
    } catch (err) {
      console.error(err)
      apiResponse.value = '❌ Failed to generate AI recommendations.'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  input[type="file"] {
    display: block;
  }
  </style>
  
  