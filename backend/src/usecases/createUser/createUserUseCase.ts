/* eslint-disable no-useless-constructor */

import { IUsersRepository } from '@repositories/IUsersRepository'
import { IFilesRepository } from '@repositories/IFilesRepository'
import { ICreateUserRequestDTO, ICreateUserResponseDTO } from './createUserDTO'
import { User } from '@entities/User'
import { IMailProvider } from '@providers/IMailProvider'

export class CreateUserUseCase {
  constructor (
      private usersRepository: IUsersRepository,
      private filesRepository: IFilesRepository,
      private emailProvider: IMailProvider
  ) {

  }

  async execute (data: ICreateUserRequestDTO): Promise<ICreateUserResponseDTO> {
    const usersAlreadyExists = await this.usersRepository.findByEmail(data.email)

    if (usersAlreadyExists) {
      throw new Error('User already exists')
    }

    let file
    if (data.file) {
      file = await this.filesRepository.getOne(data.file.id)

      if (!file) {
        throw new Error('File not found')
      }
    }

    const user = User.create({
      email: data.email,
      name: data.name,
      file: file,
      abstract: data.abstract,
      jobtitle: data.jobtitle,
      phone: data.phone
    })

    const createdUser = await this.usersRepository.save(user)

    this.emailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email
      },
      from: {
        name: 'Equipe Send Worker',
        email: 'equipe@email.com'
      },
      subject: 'Recebemos sua candidatura',
      body: '<p>Você já pode fazer login em nossa plataforma</p>'
    })

    const createdUserDTO = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone ?? undefined,
      jobtitle: createdUser.jobtitle ?? undefined,
      abstract: createdUser.abstract ?? undefined,
      file: createdUser.file
        ? {
            id: createdUser.file.id,
            name: createdUser.file.name,
            url: createdUser.file.url
          }
        : undefined
    } as ICreateUserResponseDTO

    return createdUserDTO
  }
}