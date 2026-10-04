import { PrismaClient } from '../../generated/prisma/client'
import { File } from '@entities/File'
import { IFilesRepository } from '@repositories/IFilesRepository'

export class PrismaFilesRepository implements IFilesRepository {
  constructor (private prisma: PrismaClient) {}

  async save (file: Omit<File, 'id'>): Promise<File> {
    const created = await this.prisma.file.create({
      data: { name: file.name, size: file.size, key: file.key, url: file.url }
    })

    return File.restore(created)
  }

  async getOne(id: number): Promise<File | null> {
    const file = await this.prisma.file.findUnique({
      where: { id }
    })

    return file ? File.restore(file) : null
  }
}
