jest.mock('./database/prismaClient', () => ({ prismaClient: {} }))
jest.mock('@providers/implementations/mailtrapMailProvider', () => ({ MailtrapMailProvider: function () {} }))

describe('use case wiring', () => {
  it('createUser', () => {
    const m = require('@usecases/createUser')
    expect(m.createUserUseCase).toBeDefined()
    expect(m.createUserController).toBeDefined()
  })

  it('extractInfo', () => {
    const m = require('@usecases/extractInfo')
    expect(m.extractInfoUseCase).toBeDefined()
    expect(m.extractInfoController).toBeDefined()
  })

  it('listAllUsers', () => {
    const m = require('@usecases/listAllUsers')
    expect(m.listAllUsersController).toBeDefined()
    expect(m.createUserUseCase).toBeDefined()
  })

  it('uploadFile', () => {
    const m = require('@usecases/uploadFile')
    expect(m.uploadFileUseCase).toBeDefined()
    expect(m.uploadFileController).toBeDefined()
  })
})
