import { ListAllUsersController } from './listAllUsersController'
import { ListAllUsersUseCase } from './listAllUsersUseCase'

const makeResponse = () => {
  const response: any = {}
  response.status = jest.fn().mockReturnValue(response)
  response.json = jest.fn().mockReturnValue(response)
  return response
}

describe('ListAllUsersUseCase', () => {
  it('returns the users from the repository', async () => {
    const repository = { list: jest.fn().mockResolvedValue([{ id: 1 }]), findByEmail: jest.fn(), save: jest.fn() }
    await expect(new ListAllUsersUseCase(repository as any).execute()).resolves.toEqual([{ id: 1 }])
  })
})

describe('ListAllUsersController', () => {
  it('returns 200 with the users', async () => {
    const response = makeResponse()
    await new ListAllUsersController({ execute: jest.fn().mockResolvedValue([{ id: 1 }]) } as any)
      .handle({} as any, response)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith([{ id: 1 }])
  })

  it('returns 400 with the error message or a default one', async () => {
    const response = makeResponse()
    await new ListAllUsersController({ execute: jest.fn().mockRejectedValue(new Error('x')) } as any)
      .handle({} as any, response)
    expect(response.json).toHaveBeenCalledWith({ message: 'x' })

    await new ListAllUsersController({ execute: jest.fn().mockRejectedValue({}) } as any)
      .handle({} as any, response)
    expect(response.json).toHaveBeenCalledWith({ message: 'Unexpected error.' })
  })
})
