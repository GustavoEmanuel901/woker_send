/* eslint-disable no-useless-constructor */

import { PDFParse } from 'pdf-parse'
import { IFilesRepository } from '@repositories/IFilesRepository'
import { IStorageProvider } from '@providers/IStorageProvider'
import { IResumeExtractorProvider } from '@providers/IResumeExtractorProvider'
import { IUserInfoExtractDTO } from './extractInfoDTO'

const MAX_TEXT_LENGTH = 12000

export class ExtractInfoUseCase {
  constructor (
    private fileRepository: IFilesRepository,
    private storageProvider: IStorageProvider,
    private resumeExtractor: IResumeExtractorProvider
  ) {}

  async execute (id: number): Promise<IUserInfoExtractDTO> {
    const file = await this.fileRepository.getOne(id)

    if (!file) {
      throw new Error('File not found.')
    }

    const buffer = await this.storageProvider.get(file.key)

    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    let text: string
    try {
      text = (await parser.getText()).text.trim()
    } finally {
      await parser.destroy()
    }

    if (!text) {
      throw new Error('Could not read any text from the file.')
    }

    return this.resumeExtractor.extract(text.slice(0, MAX_TEXT_LENGTH))
  }
}
