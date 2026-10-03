import { File } from '@entities/File'
import { IStorageProvider } from '@providers/IStorageProvider'
import { IFilesRepository } from '@repositories/IFilesRepository'
import { IUploadFileRequestDTO } from './uploadFileDTO'

const ALLOWED_MIME_TYPES = ['application/pdf']

export class UploadFileUseCase {
  constructor (
    private filesRepository: IFilesRepository,
    private storageProvider: IStorageProvider
  ) {}

  async execute (data: IUploadFileRequestDTO): Promise<File> {
    if (!ALLOWED_MIME_TYPES.includes(data.mimeType)) {
      throw new Error('File type not allowed.')
    }

    const { key, url } = await this.storageProvider.save(data)

    try {
      return await this.filesRepository.save(
        File.create({ name: data.originalName, size: data.size, key, url })
      )
    } catch (error) {
      console.log('Error saving file to repository:', error);
      // evita arquivo órfão no storage se o banco falhar
      await this.storageProvider.delete(key)
      throw error
    }
  }
}
