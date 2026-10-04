import { PrismaClient } from '../../generated/prisma/client'
import { User } from '@entities/User'
import { File } from '@entities/File'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
  constructor (private prisma: PrismaClient) {}

  async findByEmail (email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { file: true }
    })

    return user
      ? User.restore({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone ?? undefined,
          jobtitle: user.jobtitle ?? undefined,
          abstract: user.abstract ?? undefined,
          file: File.restore(user.file)
        })
      : null
  }

  async save (user: Omit<User, 'id'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        jobtitle: user.jobtitle,
        abstract: user.abstract,
        file: {
          create: {
            name: user.file.name,
            size: user.file.size,
            key: user.file.key,
            url: user.file.url
          }
        }
      },
      include: { file: true }
    })

    return User.restore({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone ?? undefined,
      jobtitle: createdUser.jobtitle ?? undefined,
      abstract: createdUser.abstract ?? undefined,
      file: File.restore(createdUser.file)
    })
  }

  async list (): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { file: true }
    })

    return users.map(user =>
      User.restore({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        jobtitle: user.jobtitle ?? undefined,
        abstract: user.abstract ?? undefined,
        file: File.restore(user.file)
      })
    )
  }
}