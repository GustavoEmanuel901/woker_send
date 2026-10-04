const mockSendMail = jest.fn()
const mockCreateTransport = jest.fn()

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: (options: unknown) => {
      mockCreateTransport(options)
      return { sendMail: mockSendMail }
    }
  }
}))
jest.mock('dotenv/config', () => ({}))

import { MailtrapMailProvider } from './mailtrapMailProvider'
import { makeStorageProvider } from '../storageProvider'
import { LocalStorageProvider } from './localStorageProvider'
import { S3StorageProvider } from './s3StorageProvider'

describe('MailtrapMailProvider', () => {
  it('creates the transport and sends mail', async () => {
    process.env.MAILTRAP_HOST = 'host'
    process.env.MAILTRAP_USERNAME = 'user'
    process.env.MAILTRAP_PASSWORD = 'pass'
    mockSendMail.mockResolvedValue(undefined)

    const provider = new MailtrapMailProvider()
    await provider.sendMail({
      to: { name: 'Ana', email: 'ana@a.com' },
      from: { name: 'Equipe', email: 'eq@a.com' },
      subject: 'Oi',
      body: '<p>x</p>'
    })

    expect(mockCreateTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: 'host',
      auth: { user: 'user', pass: 'pass' }
    }))
    expect(mockSendMail).toHaveBeenCalledWith({
      to: { name: 'Ana', address: 'ana@a.com' },
      from: { name: 'Equipe', address: 'eq@a.com' },
      subject: 'Oi',
      html: '<p>x</p>'
    })
  })
})

describe('makeStorageProvider', () => {
  afterEach(() => {
    delete process.env.STORAGE_DRIVER
  })

  it('returns the local provider by default', () => {
    expect(makeStorageProvider()).toBeInstanceOf(LocalStorageProvider)
  })

  it('returns the S3 provider when configured', () => {
    process.env.STORAGE_DRIVER = 's3'
    expect(makeStorageProvider()).toBeInstanceOf(S3StorageProvider)
  })
})
