/* eslint-disable no-useless-constructor */

import { IUsersRepository } from '@repositories/IUsersRepository'
// import { IListAllUsersRequestDTO } from './listAllUsersDTO'
import { User } from '@entities/User'

export class ListAllUsersUseCase {
  constructor (
      private usersRepository: IUsersRepository,
  ) {

  }

  async execute (): Promise<User[]> {
    const users = await this.usersRepository.list()

    return users
  }
}