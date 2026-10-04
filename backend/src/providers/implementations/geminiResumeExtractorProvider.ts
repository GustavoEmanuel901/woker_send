import { IResumeExtractorProvider } from '@providers/IResumeExtractorProvider'
import { IUserInfoExtractDTO } from '@usecases/extractInfo/extractInfoDTO'

const FIELDS = ['name', 'phone', 'email', 'jobtitle', 'abstract'] as const

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING', description: 'Full name of the candidate' },
    phone: { type: 'STRING', description: 'Phone number' },
    email: { type: 'STRING', description: 'E-mail address' },
    jobtitle: { type: 'STRING', description: 'Current or desired job title' },
    abstract: { type: 'STRING', description: 'Short professional summary, max 3 sentences' }
  },
  required: [...FIELDS]
}

export class GeminiResumeExtractorProvider implements IResumeExtractorProvider {
  async extract (resumeText: string): Promise<IUserInfoExtractDTO> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

    const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: 'You extract data from resumes. Answer only with JSON matching the schema. Use only information present in the resume; use an empty string when a field is not found. Write the abstract in the same language as the resume.'
          }]
        },
        contents: [{ role: 'user', parts: [{ text: resumeText }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
          responseSchema: SCHEMA
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini request failed (${response.status}): ${await response.text()}`)
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Gemini returned an empty response')

    const parsed = JSON.parse(text) as Record<string, unknown>

    const result: IUserInfoExtractDTO = {}
    for (const field of FIELDS) {
      const value = parsed[field]
      if (typeof value === 'string' && value.trim()) result[field] = value.trim()
    }

    return result
  }
}
