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
    const modelName = typeof metadata?.recommended_model === 'string' ? metadata.recommended_model.toLowerCase() : null
    const industry = typeof metadata?.industry === 'string' ? metadata.industry.toLowerCase() : null
    const studyTitles = Array.isArray(metadata?.relevant_case_studies) ? metadata.relevant_case_studies : []
  
    const model = modelName
      ? frameworks.find(f => typeof f.name === 'string' && f.name.toLowerCase() === modelName)
      : null
  
    const caseStudyBlocks = studyTitles
      .map(title => {
        if (typeof title === 'string') {
          return caseStudies.find(cs => typeof cs.title === 'string' && cs.title.toLowerCase() === title.toLowerCase())
        }
        return null
      })
      .filter(Boolean)
  
    const trendBlock = industry
      ? trends.find(t => typeof t.industry === 'string' && t.industry.toLowerCase() === industry)
      : null
  
    return { model, caseStudies: caseStudyBlocks || [], trend: trendBlock || null }
  }
  
  
  // Step 3: Build final prompt with injected context
  export function buildFinalPrompt({ changeText, model, trend, caseStudies }) {
    const modelBlock = model ? `### Framework – ${model.name}
${model.description}

**Stages:**
${model.stages.map(s => `- **${s.stage}**${s.brief ? ` (${s.brief})` : ''}: ${s.details}`).join('\n\n')}

${model.Implementation ? `**Implementation:**
${Array.isArray(model.Implementation) ? model.Implementation.map(imp => Object.entries(imp).filter(([k, v]) => k && v).map(([k, v]) => `- **${k}**: ${v}`).join('\n')).join('\n') : model.Implementation}` : ''}

${model.Challenges ? `**Challenges:**
${model.Challenges}` : ''}` : ''

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
  