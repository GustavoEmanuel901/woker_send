import { makeStorageProvider } from '@providers/storageProvider'
import { GeminiResumeExtractorProvider } from '@providers/implementations/geminiResumeExtractorProvider'
import { RegexResumeExtractorProvider } from '@providers/implementations/regexResumeExtractorProvider'
import { FallbackResumeExtractorProvider } from '@providers/implementations/fallbackResumeExtractorProvider'
import { PrismaFilesRepository } from '@repositories/implementations/PrismaFilesRepository'
import { prismaClient } from '../../database/prismaClient'
import { ExtractInfoUseCase } from './extractInfoUseCase'
import { ExtractInfoController } from './extractInfoController'

const filesRepository = new PrismaFilesRepository(prismaClient)

const extractInfoUseCase = new ExtractInfoUseCase(
  filesRepository,
  makeStorageProvider(),
  new FallbackResumeExtractorProvider(
    new GeminiResumeExtractorProvider(),
    new RegexResumeExtractorProvider()
  )
)

const extractInfoController = new ExtractInfoController(extractInfoUseCase)

export { extractInfoUseCase, extractInfoController }
