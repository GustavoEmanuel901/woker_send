import { File } from '@entities/File'

export interface IFilesRepository {
  save(file: Omit<File, 'id'>): Promise<File>
  getOne(id: number): Promise<File | null>
}
