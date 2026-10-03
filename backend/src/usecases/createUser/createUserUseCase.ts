/* eslint-disable no-useless-constructor */

import { IUsersRepository } from '@repositories/IUsersRepository'
import { ICreateUserRequestDTO } from './createUserDTO'
import { User } from '@entities/User'
import { IMailProvider } from '@providers/IMailProvider'

export class CreateUserUseCase {
  constructor (
      private usersRepository: IUsersRepository,
      private emailProvider: IMailProvider
  ) {

  }

  async execute (data: ICreateUserRequestDTO) {
    const usersAlreadyExists = await this.usersRepository.findByEmail(data.email)

    if (usersAlreadyExists) {
      throw new Error('User already exists')
    }

    const user = User.create(data)

    await this.usersRepository.save(user)

    this.emailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email
      },
      from: {
        name: 'Equipe do Meu App',
        email: 'equipe@email.com'
      },
      subject: 'Seja Bem vindo a plataforma',
      body: '<p>Você já pode fazer login em nossa plataforma</p>'
    })
  }
}