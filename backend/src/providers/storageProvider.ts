import { IStorageProvider } from '@providers/IStorageProvider'
import { LocalStorageProvider } from '@providers/implementations/localStorageProvider'
import { S3StorageProvider } from '@providers/implementations/s3StorageProvider'

export function makeStorageProvider (): IStorageProvider {
  return process.env.STORAGE_DRIVER === 's3' ? new S3StorageProvider() : new LocalStorageProvider()
}
