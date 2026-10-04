import request from 'supertest'

jest.mock('@usecases/createUser', () => ({ createUserController: { handle: (_q: any, r: any) => r.status(201).json({ ok: 'create' }) } }))
jest.mock('@usecases/listAllUsers', () => ({ listAllUsersController: { handle: (_q: any, r: any) => r.json({ ok: 'list' }) } }))
jest.mock('@usecases/uploadFile', () => ({ uploadFileController: { handle: (q: any, r: any) => r.json({ ok: 'upload', file: !!q.file }) } }))
jest.mock('@usecases/extractInfo', () => ({ extractInfoController: { handle: (q: any, r: any) => r.json({ ok: 'extract', id: q.params.id }) } }))

import { app } from './app'

describe('routes', () => {
  it('POST /users', async () => {
    const res = await request(app).post('/users').send({})
    expect(res.status).toBe(201)
  })

  it('GET /users', async () => {
    expect((await request(app).get('/users')).body).toEqual({ ok: 'list' })
  })

  it('POST /files', async () => {
    const res = await request(app).post('/files').attach('file', Buffer.from('x'), 'a.pdf')
    expect(res.body).toEqual({ ok: 'upload', file: true })
  })

  it('POST /files/:id/extract', async () => {
    expect((await request(app).post('/files/7/extract')).body).toEqual({ ok: 'extract', id: '7' })
  })
})
