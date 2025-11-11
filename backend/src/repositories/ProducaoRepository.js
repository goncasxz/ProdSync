import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

export class ProducaoRepository {
  async executeProductionTransaction({ produtoId, quantidadeProduzida, materiasPrimas, usuarioId }) {
    if (!quantidadeProduzida || quantidadeProduzida <= 0) {
      throw new Error('A quantidade produzida deve ser maior que zero.');
    }

    const uniqueIds = new Set(materiasPrimas.map(mp => mp.id));
    if (uniqueIds.size !== materiasPrimas.length) {
      throw new Error('Há matérias-primas duplicadas na lista.');
    }

    return await prisma.$transaction(async (tx) => {
      const produto = await tx.produto.findUnique({ where: { id: produtoId } });
      if (!produto) throw new Error('Produto não encontrado.');

      const mpRecords = [];
      for (const item of materiasPrimas) {
        const mp = await tx.materiaPrima.findUnique({ where: { id: item.id } });
        if (!mp) throw new Error(`Matéria-prima id=${item.id} não encontrada.`);
        if (mp.quantidade < item.quantidadeUsada) {
          throw new Error(`Estoque insuficiente para ${mp.nome} (tem ${mp.quantidade}, precisa ${item.quantidadeUsada}).`);
        }
        mpRecords.push(mp);
      }

      for (const item of materiasPrimas) {
        await tx.materiaPrima.update({
          where: { id: item.id },
          data: { quantidade: { decrement: item.quantidadeUsada } }
        });
      }

      const produtoAtualizado = await tx.produto.update({
        where: { id: produtoId },
        data: { quantidade: { increment: quantidadeProduzida } }
      });

      const producoesCriadas = [];
      for (const item of materiasPrimas) {
        const rec = await tx.producao.create({
          data: {
            materiaPrimaId: item.id,
            produtoId,
            quantidadeUsada: item.quantidadeUsada,
            usuarioId
          }
        });
        producoesCriadas.push(rec);
      }
      const resposta = {
        ok: true,
        produtoAtualizado: {
          id: produtoAtualizado.id,
          nome: produtoAtualizado.nome,
          novaQuantidade: produtoAtualizado.quantidade
        },
        materiasPrimasUsadas: mpRecords.map(mp => {
          const usado = materiasPrimas.find(i => i.id === mp.id);
          return {
            id: mp.id,
            nome: mp.nome,
            lote: mp.lote,
            quantidadeUsada: usado.quantidadeUsada,
            quantidadeRestante: mp.quantidade - usado.quantidadeUsada
          };
        }),
        producoes: producoesCriadas
      };

      return resposta;
    });
  }

  async listAll() {
    return await prisma.producao.findMany({
      orderBy: { dataProducao: 'desc' },
      include: {
        produto: true,
        materiaPrima: true
      }
    });
  }

  async findByProdutoId(produtoId) {
    return await prisma.producao.findMany({
      where: { produtoId },
      include: {
        produto: true,
        materiaPrima: true
      }
    });
  }
}
