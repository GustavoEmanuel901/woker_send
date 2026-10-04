const mockPrismaMssql = jest.fn()
const mockPrismaClient = jest.fn()
jest.mock('dotenv/config', () => ({}))
jest.mock('@prisma/adapter-mssql', () => ({ PrismaMssql: function (config: unknown) { mockPrismaMssql(config) } }))
jest.mock('../generated/prisma/client', () => ({ PrismaClient: function (options: unknown) { mockPrismaClient(options) } }))

const ENV = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']

describe('prismaClient', () => {
  beforeEach(() => {
    jest.resetModules()
    ENV.forEach(name => { process.env[name] = name === 'DB_PORT' ? '1444' : name.toLowerCase() })
  })

  it('builds the adapter from env', () => {
    const mod = require('./prismaClient')
    expect(mod.prismaClient).toBeDefined()
    expect(mockPrismaMssql).toHaveBeenCalledWith(expect.objectContaining({ server: 'db_host', port: 1444, database: 'db_name' }))
    expect(mockPrismaClient).toHaveBeenCalled()
  })

  it('defaults the port', () => {
    delete process.env.DB_PORT
    require('./prismaClient')
    expect(mockPrismaMssql).toHaveBeenLastCalledWith(expect.objectContaining({ port: 1433 }))
  })

  it('throws when a variable is missing', () => {
    delete process.env.DB_HOST
    expect(() => require('./prismaClient')).toThrow('Missing required environment variable: DB_HOST')
  })
})
