export class ProducaoService {
  constructor(producaoRepo, produtoRepo, materiaPrimaRepo) {
    this.producaoRepo = producaoRepo;
    this.produtoRepo = produtoRepo;
    this.materiaPrimaRepo = materiaPrimaRepo;
  }

  async produzir({ produtoId, quantidadeProduzida, materiasPrimas, usuarioId }) {
    if (!produtoId || quantidadeProduzida == null || !Array.isArray(materiasPrimas) || materiasPrimas.length === 0) {
      throw new Error('produtoId, quantidadeProduzida e materiasPrimas são obrigatórios.');
    }

    if (quantidadeProduzida <= 0) throw new Error('quantidadeProduzida deve ser maior que zero.');

    for (const it of materiasPrimas) {
      if (!it.id || it.quantidadeUsada == null) throw new Error('Cada item em materiasPrimas precisa de id e quantidadeUsada.');
      if (it.quantidadeUsada <= 0) throw new Error('quantidadeUsada precisa ser maior que zero.');
    }

    const ids = materiasPrimas.map(m => Number(m.id));
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      throw new Error('Há matérias-primas duplicadas na lista. Consolidar quantidades ou enviar cada MP apenas uma vez.');
    }

    const produto = await this.produtoRepo.buscarProdutoPorId(produtoId);
    if (!produto) throw new Error('Produto não encontrado.');

    const result = await this.producaoRepo.executeProductionTransaction({
      produtoId,
      quantidadeProduzida,
      materiasPrimas,
      usuarioId
    });

    return result;
  }

  async listarProducoes() {
    return await this.producaoRepo.listAll();
  }

  async listarProducoesPorProduto(produtoId) {
    return await this.producaoRepo.findByProdutoId(produtoId);
  }
}
