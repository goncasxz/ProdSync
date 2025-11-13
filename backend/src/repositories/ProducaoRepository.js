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

      // Verifica cada matéria-prima
      const mpRecords = [];
      for (const item of materiasPrimas) {
        const mp = await tx.materiaPrima.findUnique({ where: { id: item.id } });
        if (!mp) throw new Error(`Matéria-prima id=${item.id} não encontrada.`);
        if (mp.quantidade < item.quantidadeUsada) {
          throw new Error(`Estoque insuficiente para ${mp.nome}.`);
        }
        mpRecords.push(mp);
      }

      // Atualiza o estoque das MPs
      for (const item of materiasPrimas) {
        await tx.materiaPrima.update({
          where: { id: item.id },
          data: { quantidade: { decrement: item.quantidadeUsada } }
        });
      }

      // Atualiza o produto final
      const produtoAtualizado = await tx.produto.update({
        where: { id: produtoId },
        data: { quantidade: { increment: quantidadeProduzida } }
      });

      // Gera o lote
      const random = Math.floor(1000 + Math.random() * 9000);
      const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const lote = `PROD-${data}-${random}`;

      // Cria a produção
      const producaoCriada = await tx.producao.create({
        data: {
          produtoId,
          quantidadeProduzida,
          usuarioId,
          lote,
        },
      });

      // Relaciona cada matéria-prima usada
      for (const item of materiasPrimas) {
        await tx.producaoMateriaPrima.create({
          data: {
            producaoId: producaoCriada.id,
            materiaPrimaId: item.id,
            quantidadeUsada: item.quantidadeUsada,
          },
        });
      }

      return {
        ok: true,
        lote,
        message: 'Produção registrada com sucesso.',
        producao: {
          id: producaoCriada.id,
          produtoId,
          nomeProduto: produto.nome,
          novaQuantidade: produtoAtualizado.quantidade,
          quantidadeProduzida,
          usuarioId,
          dataProducao: producaoCriada.dataProducao,
          materiasPrimasUsadas: materiasPrimas.map(mp => ({
            id: mp.id,
            nome: mpRecords.find(r => r.id === mp.id).nome,
            quantidadeUsada: mp.quantidadeUsada,
            lote: mp.lote
          }))
        }
      };
    });
  }

  async listAll() {
    return await prisma.producao.findMany({
      orderBy: { dataProducao: 'desc' },
      include: {
        produto: true,
        usuario: { select: { id: true, nome: true, email: true } },
        materiasPrimasUsadas: {
          include: { materiaPrima: true }
        }
      }
    });
  }

  async findByProdutoId(produtoId) {
    return await prisma.producao.findMany({
      where: { produtoId },
      orderBy: { dataProducao: 'desc' },
      include: {
        produto: true,
        usuario: { select: { id: true, nome: true, email: true } },
        materiasPrimasUsadas: {
          include: { materiaPrima: true }
        }
      }
    });
  }

  async findByLote(lote) {
    return await prisma.producao.findMany({
      where: { lote },
      include: {
        produto: true,
        usuario: { select: { id: true, nome: true, email: true } },
        materiasPrimasUsadas: {
          include: {
            materiaPrima: true
          }
        }
      }
    });
}

}


