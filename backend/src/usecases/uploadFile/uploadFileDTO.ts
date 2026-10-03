export interface IUploadFileRequestDTO {
  buffer: Buffer
  originalName: string
  mimeType: string
  size: number
}
