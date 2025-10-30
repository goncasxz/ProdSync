import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export class UsuarioRepository {
    async criarUsuario(usuario) {
        return await prisma.usuario.create({
            data: usuario
        });
    }

    async buscarUsuarios() {
        return await prisma.usuario.findMany();
    }

    async buscarUsuarioPorId(id) {
        return await prisma.usuario.findUnique({
            where: { id }
        });
    }

    async atualizarUsuario(id, dadosAtualizados) {
        return await prisma.usuario.update({
            where: { id },
            data: dadosAtualizados
        });
    }

    async deletarUsuario(id) {
        return await prisma.usuario.delete({
            where: { id }
        });
    }
}