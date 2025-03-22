// Step 1: Build metadata extraction prompt
export function buildMetadataPrompt(changeText) {
    return `
  You are a change management strategist.
  
  Given the following change plan, identify:
  - The primary industry or domain
  - The change management model that best applies
  - Any common case studies or industry trends that might be relevant
  
  Respond ONLY with a JSON object in this format:
  {
    "industry": "...",
    "recommended_model": "...",
    "relevant_case_studies": ["...", "..."]
  }
  
  Plan:
  ---
  ${changeText}
  ---
  `.trim()
  }
  
  // Step 2: Simulated local context store (can be replaced with imports)
  import frameworks from '@/data/frameworks.json'
  import caseStudies from '@/data/caseStudies.json'
  import trends from '@/data/trends.json'
  
  export function getContextFromMetadata(metadata) {
    const model = frameworks.find(f => f.name.toLowerCase() === metadata.recommended_model.toLowerCase())
    const caseStudyBlocks = metadata.relevant_case_studies
      .map(title => caseStudies.find(cs => cs.title.toLowerCase() === title.toLowerCase()))
      .filter(Boolean)
    const trendBlock = trends.find(t => t.industry.toLowerCase() === metadata.industry.toLowerCase())
  
    return { model, caseStudies: caseStudyBlocks, trend: trendBlock }
  }
  
  // Step 3: Build final prompt with injected context
  export function buildFinalPrompt({ changeText, model, trend, caseStudies }) {
    const modelBlock = model ? `### Framework – ${model.name}\n${model.description}\n${model.stages.map(s => `- ${s.stage}: ${s.details}`).join('\n')}` : ''
    const trendBlock = trend ? `### Industry Trends – ${trend.industry}\n${trend.details}` : ''
    const casesBlock = caseStudies.length > 0 ? `### Case Studies\n${caseStudies.map(c => `- ${c.title}: ${c.summary}`).join('\n')}` : ''
  
    return `
  You are an expert AI assistant specialized in organizational change.
  
  Here is a user-submitted change plan:
  ---
  ${changeText}
  ---
  
  Use the following contextual information:
  ${modelBlock}\n\n${trendBlock}\n\n${casesBlock}
  
  Generate a step-by-step implementation strategy and a suggested timeline.
  `.trim()
  }
  