import express from 'express'
import { router } from './routes'
import { LOCAL_UPLOADS_DIR } from '@providers/implementations/localStorageProvider'

const app = express()

app.use(express.json())
app.use('/uploads', express.static(LOCAL_UPLOADS_DIR))
app.use(router)

export { app }
