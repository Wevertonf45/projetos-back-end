import express, { json } from 'express'
import publicRoute from './routes/public.js'
import privateRoute from './routes/private.js'
import auth from './middlewares/auth.js'
import cors from 'cors'

const app = express()

app.use(cors({ origin: 'https://formdelogin.vercel.app', credentials: true }))
app.use(express.json())
app.use('/', publicRoute)
app.use('/', auth, privateRoute)
app.listen(3333, () => console.log('Servidor rodando na porta 3333!'))