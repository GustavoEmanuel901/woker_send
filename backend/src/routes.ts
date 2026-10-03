import { Router } from 'express'
import { createUserController } from '@usecases/createUser'
import { listAllUsersController } from '@usecases/listAllUsers'

const router = Router()

router.post('/users', (request, response) => {
  return createUserController.handle(request, response)
})

router.get('/users', (request, response) => {
  return listAllUsersController.handle(request, response)
})

export { router }