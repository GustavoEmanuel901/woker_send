import { validateCreateUser, ValidationError } from './createUserValidator'

const valid = {
  name: '  Ana   Maria ',
  email: ' ANA@Email.com ',
  phone: '+55 (11) 99999-9999',
  jobtitle: ' Dev ',
  abstract: ' Resumo ',
  file: { id: '5' }
}

const errorsOf = async (body: unknown): Promise<Record<string, string>> => {
  try {
    await validateCreateUser(body)
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    return (error as ValidationError).errors
  }
  throw new Error('expected validation to fail')
}

describe('validateCreateUser edge cases', () => {
  it('reports a null name', async () => {
    expect(Object.keys(await errorsOf({ ...valid, name: null }))).toContain('name')
  })

  it('reports a non-object body under "body"', async () => {
    expect(Object.keys(await errorsOf('texto'))).toEqual(['body'])
  })
})

describe('validateCreateUser', () => {
  it('normalizes valid data', async () => {
    await expect(validateCreateUser(valid)).resolves.toEqual({
      name: 'Ana Maria',
      email: 'ana@email.com',
      phone: '+55 (11) 99999-9999',
      jobtitle: 'Dev',
      abstract: 'Resumo',
      file: { id: 5 }
    })
  })

  it('accepts only required fields and turns empty optionals into undefined', async () => {
    const result = await validateCreateUser({ name: 'Ana', email: 'a@a.com', phone: '', jobtitle: '', abstract: '', file: { id: 1 } })
    expect(result.phone).toBeUndefined()
    expect(result.jobtitle).toBeUndefined()
    expect(result.abstract).toBeUndefined()
  })

  it('reports all missing fields for undefined/null body', async () => {
    for (const body of [undefined, null, {}]) {
      const errors = await errorsOf(body)
      expect(errors).toMatchObject({
        name: 'Nome é obrigatório',
        email: 'E-mail é obrigatório'
      })
      expect(errors.file).toBeUndefined()
    }
  })

  it('accepts a body without file', async () => {
    const { file, ...withoutFile } = valid
    const result = await validateCreateUser(withoutFile)
    expect(result.file).toBeUndefined()
  })

  it('validates name length', async () => {
    expect((await errorsOf({ ...valid, name: 'A' })).name).toBe('Nome deve ter entre 2 e 120 caracteres')
    expect((await errorsOf({ ...valid, name: 'A'.repeat(121) })).name).toBe('Nome deve ter entre 2 e 120 caracteres')
  })

  it('validates email', async () => {
    expect((await errorsOf({ ...valid, email: 'invalid' })).email).toBe('E-mail inválido')
    expect((await errorsOf({ ...valid, email: `${'a'.repeat(250)}@a.com` })).email).toBeDefined()
  })

  it('validates phone', async () => {
    expect((await errorsOf({ ...valid, phone: 'abc' })).phone).toBe('Telefone inválido')
    expect((await errorsOf({ ...valid, phone: '()()()()()()' })).phone).toBe('Telefone inválido')
    expect((await errorsOf({ ...valid, phone: '1'.repeat(21) })).phone).toBeDefined()
  })

  it('validates optional text max lengths', async () => {
    expect((await errorsOf({ ...valid, jobtitle: 'a'.repeat(121) })).jobtitle).toBe('Deve ter no máximo 120 caracteres')
    expect((await errorsOf({ ...valid, abstract: 'a'.repeat(2001) })).abstract).toBe('Deve ter no máximo 2000 caracteres')
  })

  it('validates file id', async () => {
    expect((await errorsOf({ ...valid, file: { id: 'abc' } })).file).toBe('Arquivo inválido')
    expect((await errorsOf({ ...valid, file: { id: 1.5 } })).file).toBe('Arquivo inválido')
    expect((await errorsOf({ ...valid, file: { id: -1 } })).file).toBe('Arquivo inválido')
    expect((await errorsOf({ ...valid, file: {} })).file).toBe('Arquivo é obrigatório')
  })

  it('keeps only the first message per field', async () => {
    const errors = await errorsOf({ ...valid, email: '' })
    expect(typeof errors.email).toBe('string')
  })

  it('rethrows unexpected errors', async () => {
    const body = {
      get name (): string {
        throw new Error('boom')
      }
    }
    await expect(validateCreateUser(body)).rejects.toThrow('boom')
  })
})
