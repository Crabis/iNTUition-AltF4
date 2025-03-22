import { buildMetadataPrompt, getContextFromMetadata, buildFinalPrompt } from '@/utils/dualPrompt'

const API_URL = 'https://api.openrouter.ai/assist' // Replace with actual OpenRouter endpoint
const API_KEY = 'your-api-key-here' // ⚠️ Replace securely in production

async function callOpenRouter(prompt, model = 'openai/gpt-4') {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function getChangePlanRecommendations(changeText) {
  try {
    // Step 1: Metadata extraction
    const metadataPrompt = buildMetadataPrompt(changeText)
    const metadataRaw = await callOpenRouter(metadataPrompt)
    const metadata = JSON.parse(metadataRaw)

    // Step 2: Context matching
    const context = getContextFromMetadata(metadata)

    // Step 3: Build final prompt
    const finalPrompt = buildFinalPrompt({
      changeText,
      model: context.model,
      trend: context.trend,
      caseStudies: context.caseStudies
    })

    // Step 4: Final call for recommendation
    const recommendation = await callOpenRouter(finalPrompt)
    return recommendation
  } catch (err) {
    console.error('[AI Error]', err)
    throw new Error('Failed to generate AI recommendation.')
  }
}
