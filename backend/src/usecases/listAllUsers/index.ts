import { MailtrapMailProvider } from '@providers/implementations/mailtrapMailProvider'
import { PrismaUsersRepository } from '@repositories/implementations/PrismaUsersRepository'
import { prismaClient } from '../../database/prismaClient'
import { ListAllUsersUseCase } from './listAllUsersUseCase'
import { ListAllUsersController } from './listAllUsersController'
import { createUserUseCase } from '@usecases/createUser'

const usersRepository = new PrismaUsersRepository(prismaClient)

const listAllUsersUseCase = new ListAllUsersUseCase(usersRepository)

const listAllUsersController = new ListAllUsersController(listAllUsersUseCase)

export { createUserUseCase, listAllUsersController }