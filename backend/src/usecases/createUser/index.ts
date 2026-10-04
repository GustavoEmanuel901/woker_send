import { MailtrapMailProvider } from '@providers/implementations/mailtrapMailProvider'
import { PrismaUsersRepository } from '@repositories/implementations/PrismaUsersRepository'
import { PrismaFilesRepository } from '@repositories/implementations/PrismaFilesRepository'
import { prismaClient } from '../../database/prismaClient'
import { CreateUserUseCase } from './createUserUseCase'
import { CreateUserController } from './createUserController'

const mailtrapMailProvider = new MailtrapMailProvider()
const usersRepository = new PrismaUsersRepository(prismaClient)
const filesRepository = new PrismaFilesRepository(prismaClient)

const createUserUseCase = new CreateUserUseCase(usersRepository, filesRepository, mailtrapMailProvider) 

const createUserController = new CreateUserController(createUserUseCase)

export { createUserUseCase, createUserController }