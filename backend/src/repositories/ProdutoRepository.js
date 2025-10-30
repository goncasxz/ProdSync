import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export class ProdutoRepository {
    async criarProduto(produto) {
        return await prisma.produto.create({
            data: produto
        });
    }

    async buscarProdutos() {
        return await prisma.produto.findMany();
    }

    async buscarProdutoPorId(id) {
        return await prisma.produto.findUnique({
            where: { id }
        });
    }

    async atualizarProduto(id, dadosAtualizados) {
        return await prisma.produto.update({
            where: { id },
            data: dadosAtualizados
        });
    }

    async deletarProduto(id) {
        return await prisma.produto.delete({
            where: { id }
        });
    }

    async buscarProdutoPorLote(lote) {
        return await prisma.produto.findUnique({
            where: { lote }
        });
    }
}