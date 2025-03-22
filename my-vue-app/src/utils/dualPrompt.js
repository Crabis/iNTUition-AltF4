// Step 1: Build metadata extraction prompt
export function buildMetadataPrompt(changeText) {
    return `
  You are a change management strategist.
  
  Given the following change plan, identify:
  - The primary industry or domain
  - The change management model that best applies
  - Any common case studies or industry trends that might be relevant

  There are the following options for framework: "Lewin's Model" , "McKinsey's 7-S Framework" , "Nudge Theory" , "ADKAR Model" , "Kübler-Ross Change Curve"
  Set the default framework to "ADKAR Model" if no framework is identified


  Respond ONLY with a JSON object in this format:
  {
    "framework": "...",
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
  import communication from '@/data/communication.json'
  import metrics from '@/data/metrics.json'
  // import trends from '@/data/trends.json'
  
  export function getContextFromMetadata(metadata) {
    const modelName = typeof metadata?.framework === 'string'
      ? metadata.framework.toLowerCase()
      : null
  
    if (!modelName) return { model: null }
  
    const models = frameworks.change_management_models
  
    // 🔍 Find matching key (case-insensitive)
    const matchedKey = Object.keys(models).find(
      key => key.toLowerCase() === modelName
    )
  
    if (!matchedKey) return { model: null }
  
    const matchedModel = models[matchedKey]
  
    // ✅ Return with name and description promoted
    const model = {
      name: matchedKey,
      description: matchedModel.description || '',
      ...Object.fromEntries(
        Object.entries(matchedModel).filter(([k]) => k !== 'description')
      )
    }
    console.log(model)
    return { model }
  }
  
  
  export function buildFinalPrompt({ changeText, model}) {
    // 🔁 Recursively format nested objects/arrays
    const formatObject = (obj, depth = 0) => {
      const indent = '  '.repeat(depth)
      if (Array.isArray(obj)) {
        return obj.map(item => {
          if (typeof item === 'string') return `${indent}- ${item}`
          if (typeof item === 'object') return formatObject(item, depth + 1)
          return `${indent}- ${item}`
        }).join('\n')
      } else if (typeof obj === 'object') {
        return Object.entries(obj).map(([key, value]) => {
          const label = `${indent}- **${key}**:`
          if (typeof value === 'string') return `${label} ${value}`
          return `${label}\n${formatObject(value, depth + 1)}`
        }).join('\n')
      } else {
        return `${indent}${obj}`
      }
    }
  
    const modelBlock = model
      ? `### Framework – ${model.name}
  ${model.description ? model.description + '\n' : ''}
  
  **Model Details:**
  ${formatObject(Object.fromEntries(Object.entries(model).filter(([k]) => k !== 'name' && k !== 'description')))}
  `
      : ''
  
    return `
  You are an expert AI assistant specialized in organizational change.
  
  Here is a user-submitted change plan:
  ---
  ${changeText}
  ---
  
  Use the following contextual information:
  ${modelBlock}
  
  Generate a step-by-step implementation strategy and a suggested timeline.
  Generate at least 4 different phases for the timeline starting from Q2 2025, following the same structure as the rest of the text.
  The implementation strategy must be separated from the timeline. The timeline must cointain the following points, date (i.e. Q2 2025), subdate (i.e. what phase), title, subtitle, description.
  Proceed to generate the rest of the strategy based on the context.
  DO NOT FORMAT THE DATA IN A TABLE.
  `.trim()
  }
  

  export function timelinePrompt(response){
    console.log(response)
    return `
    Based on the following context:
    ---
    ${response}
    ---
    From the timeline at the bottom, extract the following data points:
    -date (i.e. Q2 2025)
    -subdate (i.e. what phase)
    -title 
    -subtitle
    -description

    Respond ONLY with a JSON object in this format based on the extracted points:
    {
    "items": [
        {
        "date": "Q4 2025",
        "subdate": "Growth Phase",
        "title": "Loyalty Program",
        "subtitle": "Customer Retention",
        "description": "Launching rewards system to increase customer lifetime value."
        },
        {
        "date": "Q3 2025",
        "subdate": "Expansion Phase",
        "title": "Channel Diversification",
        "subtitle": "Multi-platform Strategy",
        "description": "Expanding marketing efforts to new platforms and partnerships."
        }
        // DO NOT OMIT ANY ITEM. Continue until all timeline items are extracted.
    ]
    }
    `
  }