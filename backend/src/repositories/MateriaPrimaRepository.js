import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

export class MateriaPrimaRepository {
    async criarMateriaPrima(materiaPrima) {
        return await prisma.materiaPrima.create({
            data: materiaPrima
        });
    }

    async buscarMateriasPrimas() {
        return await prisma.materiaPrima.findMany();
    }

    async buscarMateriaPrimaPorId(id) {
        return await prisma.materiaPrima.findUnique({
            where: { id }
        });
    }

    async atualizarMateriaPrima(id, dadosAtualizados) {
        return await prisma.materiaPrima.update({
            where: { id },
            data: dadosAtualizados
        });
    }

    async deletarMateriaPrima(id) {
        return await prisma.materiaPrima.delete({
            where: { id }
        });
    }

    async buscarMateriaPrimaPorLote(lote) {
        return await prisma.materiaPrima.findUnique({
            where: { lote }
        });
    }
}