import { Request, Response } from 'express'
import { UploadFileUseCase } from './uploadFileUseCase'

export class UploadFileController {
  constructor (
    private uploadFileUseCase: UploadFileUseCase
  ) {}

  async handle (request: Request, response: Response): Promise<Response> {
    const file = request.file

    if (!file) {
      return response.status(400).json({ message: 'File is required (field "file").' })
    }

    try {
      const uploaded = await this.uploadFileUseCase.execute({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      })

      return response.status(201).json(uploaded)
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error.'
      })
    }
  }
}
