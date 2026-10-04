import { File } from './File'
import { User } from './User'

describe('File', () => {
  it('create returns a plain object without id', () => {
    const file = File.create({ name: 'a.pdf', size: 10, key: 'k', url: 'u' })
    expect(file).toEqual({ name: 'a.pdf', size: 10, key: 'k', url: 'u' })
    expect(file).not.toHaveProperty('id')
  })

  it('restore returns a File with id', () => {
    const file = File.restore({ id: 1, name: 'a.pdf', size: 10, key: 'k', url: 'u' })
    expect(file).toBeInstanceOf(File)
    expect(file).toMatchObject({ id: 1, name: 'a.pdf', size: 10, key: 'k', url: 'u' })
  })
})

describe('User', () => {
  const file = File.restore({ id: 1, name: 'a.pdf', size: 10, key: 'k', url: 'u' })

  it('create returns a plain object without id', () => {
    const user = User.create({ name: 'Ana', email: 'a@a.com', file, phone: '1', jobtitle: 'Dev', abstract: 'x' })
    expect(user).toEqual({ name: 'Ana', email: 'a@a.com', file, phone: '1', jobtitle: 'Dev', abstract: 'x' })
    expect(user).not.toHaveProperty('id')
  })

  it('restore returns a User with id and optional fields', () => {
    const user = User.restore({ id: 2, name: 'Ana', email: 'a@a.com', file, phone: '1', jobtitle: 'Dev', abstract: 'x' })
    expect(user).toBeInstanceOf(User)
    expect(user).toMatchObject({ id: 2, name: 'Ana', email: 'a@a.com', phone: '1', jobtitle: 'Dev', abstract: 'x' })
    expect(user.file).toBe(file)
  })

  it('restore works without optional fields', () => {
    const user = User.restore({ id: 3, name: 'Ana', email: 'a@a.com', file })
    expect(user.phone).toBeUndefined()
  })
})
