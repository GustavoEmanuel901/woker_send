import { PrismaClient } from '../../generated/prisma/client'
import { User } from '@entities/User'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
  constructor (private prisma: PrismaClient) {}

  async findByEmail (email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    return user ? User.restore(user) : null
  }

  async save (user: Omit<User, 'id'>): Promise<void> {
    await this.prisma.user.create({ data: user })
  }
}