import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '../generated/prisma/index.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

app.get('/teste', async (req, res) => {
  const usuarios = await prisma.usuario.findMany()
  res.json({ status: 'OK', usuarios })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))