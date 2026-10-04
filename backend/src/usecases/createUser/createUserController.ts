
import { Request, Response } from 'express'
import { CreateUserUseCase } from './createUserUseCase'
import { validateCreateUser, ValidationError } from './createUserValidator'

export class CreateUserController {
  constructor (
    private CreateUserUseCase: CreateUserUseCase
  ) {}

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const data = await validateCreateUser(request.body)
      const createdUser = await this.CreateUserUseCase.execute(data)

      return response.status(201).json(createdUser)
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return response.status(422).json({
          message: error.message,
          errors: error.errors
        })
      }

      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
