import { Router } from 'express'
import multer from 'multer'
import { createUserController } from '@usecases/createUser'
import { listAllUsersController } from '@usecases/listAllUsers'
import { uploadFileController } from '@usecases/uploadFile'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/users', (request, response) => {
  return createUserController.handle(request, response)
})

router.get('/users', (request, response) => {
  return listAllUsersController.handle(request, response)
})

router.post('/files', upload.single('file'), (request, response) => {
  return uploadFileController.handle(request, response)
})

export { router }
