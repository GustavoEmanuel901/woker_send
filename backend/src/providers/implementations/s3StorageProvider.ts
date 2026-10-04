import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { IStorageProvider } from '@providers/IStorageProvider'

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client
  private bucket: string

  constructor () {
    this.bucket = process.env.S3_BUCKET as string

    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      credentials: process.env.S3_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
          }
        : undefined
    })
  }

  async save (file: Parameters<IStorageProvider['save']>[0]): Promise<{ key: string; url: string }> {
    const key = `${randomUUID()}${path.extname(file.originalName).toLowerCase()}`

    try {
      await new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimeType
        }
      }).done()

      const publicUrl = process.env.S3_PUBLIC_URL ?? `https://${this.bucket}.s3.amazonaws.com`

      return { key, url: `${publicUrl}/${key}` }
    } catch (error) {
      console.log('Error uploading file to S3:', error)
      throw error
    }
  }

  async get (key: string): Promise<Buffer> {
    const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))

    return Buffer.from(await result.Body!.transformToByteArray())
  }

  async delete (key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }
}
