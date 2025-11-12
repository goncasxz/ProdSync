import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';


dotenv.config();
const app = express();

const allowed = (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    cb(new Error("CORS not allowed"));
  },
  credentials: true
}));
app.use(express.json());

const prisma = new PrismaClient();

import { UsuarioRepository } from './repositories/UsuarioRepository.js';
import { ProdutoRepository } from './repositories/ProdutoRepository.js';
import { MateriaPrimaRepository } from './repositories/MateriaPrimaRepository.js';
import { ProducaoRepository } from './repositories/ProducaoRepository.js';

const usuarioRepo = new UsuarioRepository(prisma);
const produtoRepo = new ProdutoRepository(prisma);
const materiaPrimaRepo = new MateriaPrimaRepository(prisma);
const producaoRepo = new ProducaoRepository(prisma);

import { AuthService } from './services/authService.js';
import { UsuarioService } from './services/UsuarioService.js';
import { ProdutoService } from './services/ProdutoService.js';
import { MateriaPrimaService } from './services/MateriaPrimaService.js';
import { ProducaoService } from './services/ProducaoService.js';

const authService = new AuthService(usuarioRepo);
const usuarioService = new UsuarioService(usuarioRepo);
const produtoService = new ProdutoService(produtoRepo);
const materiaPrimaService = new MateriaPrimaService(materiaPrimaRepo);
const producaoService = new ProducaoService(producaoRepo, produtoRepo, materiaPrimaRepo);

import { createAuthRoutes } from './routes/authRoute.js';
import { createUsuarioRoutes } from './routes/usuarioRoute.js';
import { createProdutoRoutes } from './routes/produtoRoute.js';
import { createMateriaPrimaRoutes } from './routes/materiaPrimaRoute.js';
import { createProducaoRoutes } from './routes/producaoRoute.js';

app.use('/auth', createAuthRoutes({ authService }));
app.use('/usuarios', createUsuarioRoutes({ usuarioService }));
app.use('/produtos', createProdutoRoutes({ produtoService }));
app.use('/materias-primas', createMateriaPrimaRoutes({ materiaPrimaService }));
app.use('/producoes', createProducaoRoutes({ producaoService }));
app.get("/ping", (req, res) => res.json({ ok: true, msg: "Backend ativo" }));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
