export interface IStorageProvider {
  save(file: { buffer: Buffer; stream?: NodeJS.ReadableStream; originalName: string; mimeType: string; size: number }): Promise<{ key: string; url: string }>
  delete(key: string): Promise<void>
}
