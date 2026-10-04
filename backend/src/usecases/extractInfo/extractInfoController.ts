import { Request, Response } from 'express'
import { ExtractInfoUseCase } from './extractInfoUseCase'

export class ExtractInfoController {
  constructor (
    private extractInfoUseCase: ExtractInfoUseCase
  ) {}

  async handle (request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id)

    if (!Number.isInteger(id)) {
      return response.status(400).json({ message: 'Invalid file id.' })
    }

    try {
      const info = await this.extractInfoUseCase.execute(id)

      return response.status(200).json(info)
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
