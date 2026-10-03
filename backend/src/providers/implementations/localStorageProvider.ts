import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { IStorageProvider } from '@providers/IStorageProvider'

export const LOCAL_UPLOADS_DIR = path.resolve(process.cwd(), process.env.LOCAL_UPLOADS_DIR ?? 'uploads')

export class LocalStorageProvider implements IStorageProvider {
  async save (file: Parameters<IStorageProvider['save']>[0]): Promise<{ key: string; url: string }> {
    const key = `${randomUUID()}${path.extname(file.originalName).toLowerCase()}`

    await mkdir(LOCAL_UPLOADS_DIR, { recursive: true })
    await writeFile(path.join(LOCAL_UPLOADS_DIR, key), file.buffer)

    const baseUrl = process.env.APP_URL ?? 'http://localhost:3333'

    return { key, url: `${baseUrl}/uploads/${key}` }
  }

  async delete (key: string): Promise<void> {
    await unlink(path.join(LOCAL_UPLOADS_DIR, path.basename(key))).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error
    })
  }
}
