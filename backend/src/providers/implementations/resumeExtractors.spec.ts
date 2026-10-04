import { FallbackResumeExtractorProvider } from './fallbackResumeExtractorProvider'
import { GeminiResumeExtractorProvider } from './geminiResumeExtractorProvider'
import { RegexResumeExtractorProvider } from './regexResumeExtractorProvider'

describe('FallbackResumeExtractorProvider', () => {
  it('merges regex result with AI result, AI taking precedence', async () => {
    const primary = { extract: jest.fn().mockResolvedValue({ name: 'IA' }) }
    const fallback = { extract: jest.fn().mockResolvedValue({ name: 'Regex', email: 'a@a.com' }) }

    await expect(new FallbackResumeExtractorProvider(primary, fallback).extract('txt'))
      .resolves.toEqual({ name: 'IA', email: 'a@a.com' })
  })

  it('uses only regex when the AI fails', async () => {
    const primary = { extract: jest.fn().mockRejectedValue(new Error('down')) }
    const fallback = { extract: jest.fn().mockResolvedValue({ email: 'a@a.com' }) }
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    await expect(new FallbackResumeExtractorProvider(primary, fallback).extract('txt'))
      .resolves.toEqual({ email: 'a@a.com' })
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('GeminiResumeExtractorProvider', () => {
  const originalEnv = process.env
  const fetchMock = jest.fn()

  beforeEach(() => {
    process.env = { ...originalEnv, GEMINI_API_KEY: 'key' } as any
    global.fetch = fetchMock as any
  })

  afterEach(() => {
    process.env = originalEnv
  })

  const okResponse = (text?: string) => ({
    ok: true,
    json: async () => ({ candidates: text === undefined ? [] : [{ content: { parts: [{ text }] } }] })
  })

  it('throws without API key', async () => {
    delete process.env.GEMINI_API_KEY
    await expect(new GeminiResumeExtractorProvider().extract('x')).rejects.toThrow('GEMINI_API_KEY is not set')
  })

  it('calls the default model and parses the response', async () => {
    fetchMock.mockResolvedValue(okResponse(JSON.stringify({
      name: ' Ana ', phone: '', email: 'a@a.com', jobtitle: 5, abstract: 'Resumo'
    })))

    const result = await new GeminiResumeExtractorProvider().extract('texto')

    expect(result).toEqual({ name: 'Ana', email: 'a@a.com', abstract: 'Resumo' })
    expect(fetchMock.mock.calls[0][0]).toContain('/models/gemini-2.0-flash:generateContent')
    expect(fetchMock.mock.calls[0][1].headers['x-goog-api-key']).toBe('key')
  })

  it('uses GEMINI_MODEL when set', async () => {
    process.env.GEMINI_MODEL = 'custom'
    fetchMock.mockResolvedValue(okResponse('{}'))

    await new GeminiResumeExtractorProvider().extract('texto')

    expect(fetchMock.mock.calls[0][0]).toContain('/models/custom:generateContent')
  })

  it('throws when the request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => 'err' })
    await expect(new GeminiResumeExtractorProvider().extract('x')).rejects.toThrow('Gemini request failed (500): err')
  })

  it('throws on empty responses', async () => {
    fetchMock.mockResolvedValue(okResponse())
    await expect(new GeminiResumeExtractorProvider().extract('x')).rejects.toThrow('Gemini returned an empty response')
  })

  it('throws when candidates are missing', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) })
    await expect(new GeminiResumeExtractorProvider().extract('x')).rejects.toThrow('Gemini returned an empty response')
  })
})

describe('RegexResumeExtractorProvider', () => {
  const sut = new RegexResumeExtractorProvider()

  it('extracts labeled fields and abstract', async () => {
    const text = [
      'Nome completo: João da Silva',
      'Email: joao.silva@email.com',
      'Telefone: (11) 98765-4321',
      'Cargo: Desenvolvedor Backend',
      '',
      'Resumo Profissional',
      'Profissional com 10 anos de experiência.',
      'Atuação em sistemas distribuídos.',
      '',
      'Experiência',
      'Empresa X'
    ].join('\n')

    await expect(sut.extract(text)).resolves.toEqual({
      name: 'João da Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 98765-4321',
      jobtitle: 'Desenvolvedor Backend',
      abstract: 'Profissional com 10 anos de experiência. Atuação em sistemas distribuídos.'
    })
  })

  it('guesses the name from the first lines and the job from keywords', async () => {
    const text = 'Maria de Souza Lima\nAnalista de Sistemas Sênior\nmaria@x.com'
    await expect(sut.extract(text)).resolves.toEqual({
      name: 'Maria de Souza Lima',
      email: 'maria@x.com',
      jobtitle: 'Analista de Sistemas Sênior'
    })
  })

  it('stops the abstract at a section header', async () => {
    const text = 'Perfil\nTexto do perfil\nHabilidades\nJS'
    expect((await sut.extract(text)).abstract).toBe('Texto do perfil')
  })

  it('truncates long abstracts', async () => {
    const text = `Resumo\n${'a'.repeat(500)}`
    const { abstract } = await sut.extract(text)
    expect(abstract).toHaveLength(400)
    expect(abstract!.endsWith('...')).toBe(true)
  })

  it('returns an empty object when nothing matches', async () => {
    await expect(sut.extract('123 456')).resolves.toEqual({})
  })

  it('skips a blank line right after the abstract header', async () => {
    expect((await sut.extract('Resumo\n\nTexto aqui')).abstract).toBe('Texto aqui')
  })

  it('ignores an abstract header with no content and blank labeled values', async () => {
    const result = await sut.extract('Resumo\nExperiência\n')
    expect(result.abstract).toBeUndefined()
  })
})
