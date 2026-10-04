import { ExtractInfoController } from './extractInfoController'
import { ExtractInfoUseCase } from './extractInfoUseCase'

const mockGetText = jest.fn()
const mockDestroy = jest.fn()

jest.mock('pdf-parse', () => ({
  PDFParse: jest.fn().mockImplementation(() => ({ getText: mockGetText, destroy: mockDestroy }))
}))

const makeResponse = () => {
  const response: any = {}
  response.status = jest.fn().mockReturnValue(response)
  response.json = jest.fn().mockReturnValue(response)
  return response
}

describe('ExtractInfoUseCase', () => {
  const makeSut = () => {
    const filesRepository = { getOne: jest.fn(), save: jest.fn() }
    const storage = { get: jest.fn().mockResolvedValue(Buffer.from('pdf')), save: jest.fn(), delete: jest.fn() }
    const extractor = { extract: jest.fn().mockResolvedValue({ name: 'Ana' }) }
    const sut = new ExtractInfoUseCase(filesRepository, storage, extractor)
    return { sut, filesRepository, storage, extractor }
  }

  it('throws if file is not found', async () => {
    const { sut, filesRepository } = makeSut()
    filesRepository.getOne.mockResolvedValue(null)
    await expect(sut.execute(1)).rejects.toThrow('File not found.')
  })

  it('throws if the PDF has no text and still destroys the parser', async () => {
    const { sut, filesRepository } = makeSut()
    filesRepository.getOne.mockResolvedValue({ key: 'k' })
    mockGetText.mockResolvedValue({ text: '   ' })
    await expect(sut.execute(1)).rejects.toThrow('Could not read any text from the file.')
    expect(mockDestroy).toHaveBeenCalled()
  })

  it('destroys the parser when getText fails', async () => {
    const { sut, filesRepository } = makeSut()
    filesRepository.getOne.mockResolvedValue({ key: 'k' })
    mockGetText.mockRejectedValue(new Error('bad pdf'))
    await expect(sut.execute(1)).rejects.toThrow('bad pdf')
    expect(mockDestroy).toHaveBeenCalled()
  })

  it('extracts info from truncated text', async () => {
    const { sut, filesRepository, storage, extractor } = makeSut()
    filesRepository.getOne.mockResolvedValue({ key: 'k' })
    mockGetText.mockResolvedValue({ text: ` ${'a'.repeat(13000)} ` })

    await expect(sut.execute(1)).resolves.toEqual({ name: 'Ana' })

    expect(storage.get).toHaveBeenCalledWith('k')
    expect(extractor.extract).toHaveBeenCalledWith('a'.repeat(12000))
  })
})

describe('ExtractInfoController', () => {
  it('returns 400 for invalid ids', async () => {
    const useCase = { execute: jest.fn() }
    const response = makeResponse()
    await new ExtractInfoController(useCase as any).handle({ params: { id: 'abc' } } as any, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid file id.' })
  })

  it('returns 200 with extracted info', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ name: 'Ana' }) }
    const response = makeResponse()
    await new ExtractInfoController(useCase as any).handle({ params: { id: '3' } } as any, response)
    expect(useCase.execute).toHaveBeenCalledWith(3)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ name: 'Ana' })
  })

  it('returns 400 with the error message or a default one', async () => {
    const response = makeResponse()
    await new ExtractInfoController({ execute: jest.fn().mockRejectedValue(new Error('x')) } as any)
      .handle({ params: { id: '1' } } as any, response)
    expect(response.json).toHaveBeenCalledWith({ message: 'x' })

    await new ExtractInfoController({ execute: jest.fn().mockRejectedValue({}) } as any)
      .handle({ params: { id: '1' } } as any, response)
    expect(response.json).toHaveBeenCalledWith({ message: 'Unexpected error.' })
  })
})
