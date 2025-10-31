import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

import { UsuarioRepository } from './repositories/UsuarioRepository.js';
import { ProdutoRepository } from './repositories/ProdutoRepository.js';
import { MateriaPrimaRepository } from './repositories/MateriaPrimaRepository.js';

const usuarioRepo = new UsuarioRepository(prisma);
const produtoRepo = new ProdutoRepository(prisma);
const materiaPrimaRepo = new MateriaPrimaRepository(prisma);

import { AuthService } from './services/authService.js';
import { UsuarioService } from './services/UsuarioService.js';
import { ProdutoService } from './services/ProdutoService.js';
import { MateriaPrimaService } from './services/MateriaPrimaService.js';

const authService = new AuthService(usuarioRepo);
const usuarioService = new UsuarioService(usuarioRepo);
const produtoService = new ProdutoService(produtoRepo, usuarioService);
const materiaPrimaService = new MateriaPrimaService(materiaPrimaRepo, usuarioService);

import { createAuthRoutes } from './routes/authRoute.js';
import { createUsuarioRoutes } from './routes/usuarioRoute.js';
import { createProdutoRoutes } from './routes/produtoRoute.js';
import { createMateriaPrimaRoutes } from './routes/materiaPrimaRoute.js';

app.use('/auth', createAuthRoutes({ authService }));
app.use('/usuarios', createUsuarioRoutes({ usuarioService }));
app.use('/produtos', createProdutoRoutes({ produtoService }));
app.use('/materias-primas', createMateriaPrimaRoutes({ materiaPrimaService }));

import { authMiddleware } from './middleware/authMiddleware.js';
app.get('/teste', authMiddleware, async (req, res) => {
    const usuarios = await prisma.usuario.findMany();
    res.json({ status: 'OK', usuarios });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
