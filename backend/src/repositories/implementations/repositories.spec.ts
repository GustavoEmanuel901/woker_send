import { PrismaFilesRepository } from './PrismaFilesRepository'
import { PrismaUsersRepository } from './PrismaUsersRepository'

const fileRow = { id: 1, name: 'cv.pdf', size: 10, key: 'k', url: 'u' }
const userRow = { id: 2, name: 'Ana', email: 'a@a.com', phone: '1', jobtitle: 'Dev', abstract: 'x', file: fileRow }
const nullableUserRow = { ...userRow, phone: null, jobtitle: null, abstract: null }

describe('PrismaFilesRepository', () => {
  it('saves a file', async () => {
    const prisma = { file: { create: jest.fn().mockResolvedValue(fileRow), findUnique: jest.fn() } }
    const result = await new PrismaFilesRepository(prisma as any).save({ name: 'cv.pdf', size: 10, key: 'k', url: 'u' })

    expect(prisma.file.create).toHaveBeenCalledWith({ data: { name: 'cv.pdf', size: 10, key: 'k', url: 'u' } })
    expect(result).toMatchObject(fileRow)
  })

  it('gets a file by id or null', async () => {
    const prisma = { file: { create: jest.fn(), findUnique: jest.fn().mockResolvedValueOnce(fileRow).mockResolvedValueOnce(null) } }
    const repository = new PrismaFilesRepository(prisma as any)

    await expect(repository.getOne(1)).resolves.toMatchObject(fileRow)
    await expect(repository.getOne(2)).resolves.toBeNull()
    expect(prisma.file.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})

describe('PrismaUsersRepository', () => {
  it('finds a user by email', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(userRow) } }
    const user = await new PrismaUsersRepository(prisma as any).findByEmail('a@a.com')

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@a.com' }, include: { file: true } })
    expect(user).toMatchObject({ id: 2, name: 'Ana', phone: '1', jobtitle: 'Dev', abstract: 'x' })
    expect(user!.file).toMatchObject(fileRow)
  })

  it('maps null columns to undefined and returns null when not found', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValueOnce(nullableUserRow).mockResolvedValueOnce(null) } }
    const repository = new PrismaUsersRepository(prisma as any)

    const user = await repository.findByEmail('a@a.com')
    expect(user!.phone).toBeUndefined()
    expect(user!.jobtitle).toBeUndefined()
    expect(user!.abstract).toBeUndefined()
    await expect(repository.findByEmail('x')).resolves.toBeNull()
  })

  it('saves a user with its file', async () => {
    const prisma = { user: { create: jest.fn().mockResolvedValue(userRow) } }
    const user = await new PrismaUsersRepository(prisma as any).save({
      name: 'Ana', email: 'a@a.com', phone: '1', jobtitle: 'Dev', abstract: 'x', file: fileRow as any
    })

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Ana', email: 'a@a.com', phone: '1', jobtitle: 'Dev', abstract: 'x',
        file: { create: { name: 'cv.pdf', size: 10, key: 'k', url: 'u' } }
      },
      include: { file: true }
    })
    expect(user.id).toBe(2)
  })

  it('maps null columns when saving', async () => {
    const prisma = { user: { create: jest.fn().mockResolvedValue(nullableUserRow) } }
    const user = await new PrismaUsersRepository(prisma as any).save({ name: 'Ana', email: 'a@a.com', file: fileRow as any })
    expect(user.phone).toBeUndefined()
    expect(user.jobtitle).toBeUndefined()
    expect(user.abstract).toBeUndefined()
  })

  it('lists users', async () => {
    const prisma = { user: { findMany: jest.fn().mockResolvedValue([userRow, nullableUserRow]) } }
    const users = await new PrismaUsersRepository(prisma as any).list()

    expect(prisma.user.findMany).toHaveBeenCalledWith({ include: { file: true } })
    expect(users).toHaveLength(2)
    expect(users[0].phone).toBe('1')
    expect(users[1].phone).toBeUndefined()
    expect(users[1].jobtitle).toBeUndefined()
    expect(users[1].abstract).toBeUndefined()
  })
})
