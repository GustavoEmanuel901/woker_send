const mockListen = jest.fn()
jest.mock('./app', () => ({ app: { listen: mockListen } }))

describe('server', () => {
  it('listens on 3333', () => {
    require('./server')
    expect(mockListen).toHaveBeenCalledWith(3333)
  })
})
