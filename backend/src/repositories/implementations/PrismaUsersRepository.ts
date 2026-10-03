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

  async save (user: Omit<User, 'id'>): Promise<void> {
    await this.prisma.user.create({
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
      }
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