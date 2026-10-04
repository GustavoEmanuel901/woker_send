import { UploadFileController } from './uploadFileController'
import { UploadFileUseCase } from './uploadFileUseCase'

const makeResponse = () => {
  const response: any = {}
  response.status = jest.fn().mockReturnValue(response)
  response.json = jest.fn().mockReturnValue(response)
  return response
}

const data = { buffer: Buffer.from('x'), originalName: 'cv.pdf', mimeType: 'application/pdf', size: 1 }

describe('UploadFileUseCase', () => {
  const makeSut = () => {
    const filesRepository = { save: jest.fn(), getOne: jest.fn() }
    const storage = {
      save: jest.fn().mockResolvedValue({ key: 'k.pdf', url: 'http://u/k.pdf' }),
      get: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined)
    }
    return { sut: new UploadFileUseCase(filesRepository, storage), filesRepository, storage }
  }

  it('rejects disallowed mime types', async () => {
    const { sut, storage } = makeSut()
    await expect(sut.execute({ ...data, mimeType: 'image/png' })).rejects.toThrow('File type not allowed.')
    expect(storage.save).not.toHaveBeenCalled()
  })

  it('stores the file and saves it in the repository', async () => {
    const { sut, filesRepository } = makeSut()
    filesRepository.save.mockResolvedValue({ id: 1 })

    await expect(sut.execute(data)).resolves.toEqual({ id: 1 })
    expect(filesRepository.save).toHaveBeenCalledWith({ name: 'cv.pdf', size: 1, key: 'k.pdf', url: 'http://u/k.pdf' })
  })

  it('deletes the stored file when the repository fails', async () => {
    const { sut, filesRepository, storage } = makeSut()
    const error = new Error('db down')
    filesRepository.save.mockRejectedValue(error)
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined)

    await expect(sut.execute(data)).rejects.toThrow(error)
    expect(storage.delete).toHaveBeenCalledWith('k.pdf')
    expect(log).toHaveBeenCalled()
    log.mockRestore()
  })
})

describe('UploadFileController', () => {
  it('returns 400 when there is no file', async () => {
    const response = makeResponse()
    await new UploadFileController({ execute: jest.fn() } as any).handle({} as any, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'File is required (field "file").' })
  })

  const request = { file: { buffer: data.buffer, originalname: 'cv.pdf', mimetype: 'application/pdf', size: 1 } }

  it('returns 201 with the uploaded file', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ id: 1 }) }
    const response = makeResponse()
    await new UploadFileController(useCase as any).handle(request as any, response)
    expect(useCase.execute).toHaveBeenCalledWith(data)
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith({ id: 1 })
  })

  it('returns 400 with the error message or a default one', async () => {
    const response = makeResponse()
    await new UploadFileController({ execute: jest.fn().mockRejectedValue(new Error('x')) } as any)
      .handle(request as any, response)
    expect(response.json).toHaveBeenCalledWith({ message: 'x' })

    await new UploadFileController({ execute: jest.fn().mockRejectedValue({}) } as any)
      .handle(request as any, response)
    expect(response.json).toHaveBeenCalledWith({ message: 'Unexpected error.' })
  })
})
