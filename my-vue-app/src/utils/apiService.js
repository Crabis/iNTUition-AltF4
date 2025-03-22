import { buildMetadataPrompt, getContextFromMetadata, buildFinalPrompt } from '@/utils/dualPrompt'
import { timelinePrompt } from './dualPrompt';

async function callOpenRouter(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY_START}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    })
  });

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function getChangePlanRecommendations(userPrompt, fileText) {
  try {
    // Step 1: Metadata extraction from user prompt only
    const metadataPrompt = buildMetadataPrompt(userPrompt)
    const metadataRaw = await callOpenRouter(metadataPrompt)

    // Attempt to extract JSON from markdown/code-block formatted string
    const jsonStart = metadataRaw.indexOf('{')
    const jsonEnd = metadataRaw.lastIndexOf('}') + 1
    const jsonStr = metadataRaw.slice(jsonStart, jsonEnd)
    const metadata = JSON.parse(jsonStr)

    // Step 2: Context matching
    const context = getContextFromMetadata(metadata)

    // Step 3: Build final prompt using file content + context
    const finalPrompt = buildFinalPrompt({
      changeText: fileText,
      model: context.model,
      trend: context.trend,
      caseStudies: context.caseStudies,
      userIntent: userPrompt
    })

    // Step 4: Final call for recommendation
    const recommendation = await callOpenRouter(finalPrompt)
    return {
        rec: recommendation, 
        context : context
    }} catch (err) {
    console.error('[AI Error]', err)
    throw new Error('Failed to generate AI recommendation.')
  }
}

export async function getTimeline(data){
    try{
    console.log(data)
    const timeline = await callOpenRouter(timelinePrompt(data))
    return timeline
    }catch(err){
        console.error('[Timeline Error]', err)
        throw new Error('Failed to generate timeline.')
    }
}
