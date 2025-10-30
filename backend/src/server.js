import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '../generated/prisma/index.js'
import { createAuthRoutes } from './routes/authRoute.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

import { AuthService } from './services/authService.js'
import { UsuarioRepository } from './repositories/UsuarioRepository.js'

const usuarioRepo = new UsuarioRepository(prisma)
const authService = new AuthService(usuarioRepo)

app.use('/auth', createAuthRoutes({ authService }))

import { authMiddleware } from './middleware/authMiddleware.js'
app.get('/teste', authMiddleware, async (req, res) => {
  const usuarios = await prisma.usuario.findMany()
  res.json({ status: 'OK', usuarios })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
