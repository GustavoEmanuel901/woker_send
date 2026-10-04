const mockSend = jest.fn()
const mockDone = jest.fn()
const mockS3Client = jest.fn()
const mockUpload = jest.fn()

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation((config) => {
    mockS3Client(config)
    return { send: mockSend }
  }),
  GetObjectCommand: jest.fn().mockImplementation((input) => ({ type: 'get', input })),
  DeleteObjectCommand: jest.fn().mockImplementation((input) => ({ type: 'delete', input }))
}))

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn().mockImplementation((options) => {
    mockUpload(options)
    return { done: mockDone }
  })
}))

import { S3StorageProvider } from './s3StorageProvider'

const S3_ENV = ['S3_BUCKET', 'S3_REGION', 'S3_ENDPOINT', 'S3_FORCE_PATH_STYLE', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_PUBLIC_URL']

describe('S3StorageProvider', () => {
  beforeEach(() => {
    S3_ENV.forEach(name => delete process.env[name])
    process.env.S3_BUCKET = 'bucket'
  })

  it('builds the client with defaults', () => {
    new S3StorageProvider() // eslint-disable-line no-new
    expect(mockS3Client).toHaveBeenCalledWith({
      region: 'us-east-1',
      endpoint: undefined,
      forcePathStyle: false,
      credentials: undefined
    })
  })

  it('builds the client from env', () => {
    process.env.S3_REGION = 'sa-east-1'
    process.env.S3_ENDPOINT = 'http://minio'
    process.env.S3_FORCE_PATH_STYLE = 'true'
    process.env.S3_ACCESS_KEY_ID = 'id'
    process.env.S3_SECRET_ACCESS_KEY = 'secret'
    new S3StorageProvider() // eslint-disable-line no-new
    expect(mockS3Client).toHaveBeenCalledWith({
      region: 'sa-east-1',
      endpoint: 'http://minio',
      forcePathStyle: true,
      credentials: { accessKeyId: 'id', secretAccessKey: 'secret' }
    })
  })

  it('uploads and returns the default public URL', async () => {
    mockDone.mockResolvedValue(undefined)
    const { key, url } = await new S3StorageProvider().save({
      buffer: Buffer.from('x'), originalName: 'CV.PDF', mimeType: 'application/pdf', size: 1
    })

    expect(key).toMatch(/\.pdf$/)
    expect(url).toBe(`https://bucket.s3.amazonaws.com/${key}`)
    expect(mockUpload.mock.calls[0][0].params).toMatchObject({ Bucket: 'bucket', Key: key, ContentType: 'application/pdf' })
  })

  it('uses S3_PUBLIC_URL when set', async () => {
    process.env.S3_PUBLIC_URL = 'http://cdn'
    mockDone.mockResolvedValue(undefined)
    const { key, url } = await new S3StorageProvider().save({
      buffer: Buffer.from('x'), originalName: 'a.pdf', mimeType: 'application/pdf', size: 1
    })
    expect(url).toBe(`http://cdn/${key}`)
  })

  it('logs and rethrows upload errors', async () => {
    const error = new Error('fail')
    mockDone.mockRejectedValue(error)
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined)

    await expect(new S3StorageProvider().save({
      buffer: Buffer.from('x'), originalName: 'a.pdf', mimeType: 'application/pdf', size: 1
    })).rejects.toThrow(error)
    expect(log).toHaveBeenCalled()
    log.mockRestore()
  })

  it('gets an object as Buffer', async () => {
    mockSend.mockResolvedValue({ Body: { transformToByteArray: async () => new Uint8Array([1, 2, 3]) } })
    const buffer = await new S3StorageProvider().get('k')
    expect(buffer).toEqual(Buffer.from([1, 2, 3]))
    expect(mockSend).toHaveBeenCalledWith({ type: 'get', input: { Bucket: 'bucket', Key: 'k' } })
  })

  it('deletes an object', async () => {
    mockSend.mockResolvedValue({})
    await new S3StorageProvider().delete('k')
    expect(mockSend).toHaveBeenCalledWith({ type: 'delete', input: { Bucket: 'bucket', Key: 'k' } })
  })
})
