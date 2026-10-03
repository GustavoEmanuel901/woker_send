
import { Request, Response } from 'express'
import { ListAllUsersUseCase } from './listAllUsersUseCase'

export class ListAllUsersController {
  constructor (
    private listAllUsersUseCase: ListAllUsersUseCase
  ) {}

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const users = await this.listAllUsersUseCase.execute()

      return response.status(200).json(users)
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}