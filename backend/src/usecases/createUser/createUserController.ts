
import { Request, Response } from 'express'
import { CreateUserUseCase } from './createUserUseCase'

export class CreateUserController {
  constructor (
    private CreateUserUseCase: CreateUserUseCase
  ) {}

  async handle (request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body

    try {
      await this.CreateUserUseCase.execute({
        name,
        email,
      })

      return response.status(201).send()
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}