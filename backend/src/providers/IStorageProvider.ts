export interface IStorageProvider {
  save(file: { buffer: Buffer; stream?: NodeJS.ReadableStream; originalName: string; mimeType: string; size: number }): Promise<{ key: string; url: string }>
  get(key: string): Promise<Buffer>
  delete(key: string): Promise<void>
}
