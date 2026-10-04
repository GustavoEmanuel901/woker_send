import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

describe('LocalStorageProvider', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'uploads-'))
  let provider: any

  beforeAll(() => {
    process.env.LOCAL_UPLOADS_DIR = dir
    jest.resetModules()
    const mod = require('./localStorageProvider')
    provider = new mod.LocalStorageProvider()
  })

  afterAll(() => {
    delete process.env.LOCAL_UPLOADS_DIR
    delete process.env.APP_URL
    rmSync(dir, { recursive: true, force: true })
  })

  it('saves, reads and deletes files using APP_URL', async () => {
    process.env.APP_URL = 'http://app'
    const { key, url } = await provider.save({ buffer: Buffer.from('abc'), originalName: 'CV.PDF' })

    expect(key).toMatch(/\.pdf$/)
    expect(url).toBe(`http://app/uploads/${key}`)
    expect(readFileSync(path.join(dir, key), 'utf8')).toBe('abc')
    expect((await provider.get(key)).toString()).toBe('abc')

    await provider.delete(key)
    expect(existsSync(path.join(dir, key))).toBe(false)
  })

  it('uses the default base URL', async () => {
    delete process.env.APP_URL
    const { url } = await provider.save({ buffer: Buffer.from('x'), originalName: 'a.pdf' })
    expect(url.startsWith('http://localhost:3333/uploads/')).toBe(true)
  })

  it('ignores missing files on delete', async () => {
    await expect(provider.delete('missing.pdf')).resolves.toBeUndefined()
  })

  it('rethrows other delete errors', async () => {
    await expect(provider.delete('..')).rejects.toBeDefined()
  })

  it('defaults the uploads dir when env is not set', () => {
    delete process.env.LOCAL_UPLOADS_DIR
    jest.resetModules()
    const mod = require('./localStorageProvider')
    expect(mod.LOCAL_UPLOADS_DIR).toBe(path.resolve(process.cwd(), 'uploads'))
  })
})
