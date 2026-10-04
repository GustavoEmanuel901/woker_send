import { CreateUserController } from './createUserController'

const makeResponse = () => {
  const response: any = {}
  response.status = jest.fn().mockReturnValue(response)
  response.json = jest.fn().mockReturnValue(response)
  return response
}

const body = { name: 'Ana', email: 'ana@a.com', file: { id: 1 } }

describe('CreateUserController', () => {
  it('returns 201 with the created user', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ id: 1 }) }
    const response = makeResponse()

    await new CreateUserController(useCase as any).handle({ body } as any, response)

    expect(useCase.execute).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@a.com', file: { id: 1 } })
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith({ id: 1 })
  })

  it('returns 422 on validation errors', async () => {
    const useCase = { execute: jest.fn() }
    const response = makeResponse()

    await new CreateUserController(useCase as any).handle({ body: {} } as any, response)

    expect(useCase.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(422)
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ name: expect.any(String) })
    }))
  })

  it('returns 400 with the error message', async () => {
    const useCase = { execute: jest.fn().mockRejectedValue(new Error('User already exists')) }
    const response = makeResponse()

    await new CreateUserController(useCase as any).handle({ body } as any, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'User already exists' })
  })

  it('returns 400 with a default message', async () => {
    const useCase = { execute: jest.fn().mockRejectedValue({}) }
    const response = makeResponse()

    await new CreateUserController(useCase as any).handle({ body } as any, response)

    expect(response.json).toHaveBeenCalledWith({ message: 'Unexpected error.' })
  })
})
