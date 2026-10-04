import * as yup from 'yup'
import { ICreateUserRequestDTO } from './createUserDTO'

export class ValidationError extends Error {
  constructor (public errors: Record<string, string>) {
    super('Validation failed')
  }
}

const optionalText = (max: number) =>
  yup
    .string()
    .trim()
    .max(max, `Deve ter no máximo ${max} caracteres`)
    .transform(value => value || undefined)
    .optional()

const createUserSchema = yup.object({
  name: yup
    .string()
    .trim()
    .transform(value => (typeof value === 'string' ? value.replace(/\s+/g, ' ') : value))
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter entre 2 e 120 caracteres')
    .max(120, 'Nome deve ter entre 2 e 120 caracteres'),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('E-mail é obrigatório')
    .max(254, 'E-mail inválido')
    .email('E-mail inválido'),
  phone: optionalText(20).test(
    'phone',
    'Telefone inválido',
    value => !value || (/^\+?[\d\s().-]{8,20}$/.test(value) && value.replace(/\D/g, '').length >= 8)
  ),
  jobtitle: optionalText(120),
  abstract: optionalText(2000),
  file: yup
    .object({
      id: yup
        .number()
        .typeError('Arquivo inválido')
        .integer('Arquivo inválido')
        .positive('Arquivo inválido')
        .required('Arquivo é obrigatório')
    })
    .required('Arquivo é obrigatório')
})

export async function validateCreateUser (body: unknown): Promise<ICreateUserRequestDTO> {
  try {
    return await createUserSchema.validate(body ?? {}, { abortEarly: false, stripUnknown: true }) as ICreateUserRequestDTO
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {}
      for (const inner of error.inner) {
        const key = inner.path?.split('.')[0] ?? 'body'
        if (!errors[key]) errors[key] = inner.message
      }
      throw new ValidationError(errors)
    }
    throw error
  }
}
