import { CreateUserUseCase } from './createUserUseCase'
import { File } from '@entities/File'
import { User } from '@entities/User'

const file = File.restore({ id: 1, name: 'cv.pdf', size: 10, key: 'k', url: 'http://u/k' })

const makeSut = () => {
  const usersRepository = { findByEmail: jest.fn(), save: jest.fn(), list: jest.fn() }
  const filesRepository = { getOne: jest.fn(), save: jest.fn() }
  const mailProvider = { sendMail: jest.fn().mockResolvedValue(undefined) }
  const sut = new CreateUserUseCase(usersRepository as any, filesRepository as any, mailProvider)
  return { sut, usersRepository, filesRepository, mailProvider }
}

const request = { name: 'Ana', email: 'ana@a.com', phone: '11999999999', jobtitle: 'Dev', abstract: 'Resumo', file: { id: 1 } }

describe('CreateUserUseCase', () => {
  it('throws if user already exists', async () => {
    const { sut, usersRepository } = makeSut()
    usersRepository.findByEmail.mockResolvedValue({ id: 1 })
    await expect(sut.execute(request)).rejects.toThrow('User already exists')
  })

  it('throws if file is not found', async () => {
    const { sut, usersRepository, filesRepository } = makeSut()
    usersRepository.findByEmail.mockResolvedValue(null)
    filesRepository.getOne.mockResolvedValue(null)
    await expect(sut.execute(request)).rejects.toThrow('File not found')
  })

  it('creates the user, sends e-mail and returns the DTO', async () => {
    const { sut, usersRepository, filesRepository, mailProvider } = makeSut()
    usersRepository.findByEmail.mockResolvedValue(null)
    filesRepository.getOne.mockResolvedValue(file)
    usersRepository.save.mockResolvedValue(
      User.restore({ id: 7, name: 'Ana', email: 'ana@a.com', phone: '11999999999', jobtitle: 'Dev', abstract: 'Resumo', file })
    )

    const result = await sut.execute(request)

    expect(usersRepository.save).toHaveBeenCalledWith({
      name: 'Ana', email: 'ana@a.com', file, abstract: 'Resumo', jobtitle: 'Dev', phone: '11999999999'
    })
    expect(mailProvider.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: { name: 'Ana', email: 'ana@a.com' } }))
    expect(result).toEqual({
      id: 7,
      name: 'Ana',
      email: 'ana@a.com',
      phone: '11999999999',
      jobtitle: 'Dev',
      abstract: 'Resumo',
      file: { id: 1, name: 'cv.pdf', url: 'http://u/k' }
    })
  })

  it('maps missing optional fields to undefined', async () => {
    const { sut, usersRepository, filesRepository } = makeSut()
    usersRepository.findByEmail.mockResolvedValue(null)
    filesRepository.getOne.mockResolvedValue(file)
    usersRepository.save.mockResolvedValue(
      { id: 8, name: 'Ana', email: 'ana@a.com', phone: null, jobtitle: null, abstract: null, file }
    )

    const result = await sut.execute({ name: 'Ana', email: 'ana@a.com', file: { id: 1 } })

    expect(result.phone).toBeUndefined()
    expect(result.jobtitle).toBeUndefined()
    expect(result.abstract).toBeUndefined()
  })
})
