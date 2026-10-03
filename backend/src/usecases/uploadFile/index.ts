import { makeStorageProvider } from '@providers/storageProvider'
import { PrismaFilesRepository } from '@repositories/implementations/PrismaFilesRepository'
import { prismaClient } from '../../database/prismaClient'
import { UploadFileUseCase } from './uploadFileUseCase'
import { UploadFileController } from './uploadFileController'

const filesRepository = new PrismaFilesRepository(prismaClient)

const uploadFileUseCase = new UploadFileUseCase(filesRepository, makeStorageProvider())

const uploadFileController = new UploadFileController(uploadFileUseCase)

export { uploadFileUseCase, uploadFileController }
