export class ProdutoService {
    constructor(produtoRepo) {
        this.produtoRepo = produtoRepo;
    }

    async criarProduto({ nome, quantidade, dataProducao, usuarioId }) {
        if (!nome || quantidade == null || !usuarioId) {
            throw new Error("Nome, quantidade e usuário são obrigatórios.");
        }

        const random = Math.floor(1000 + Math.random() * 9000);
        const data = new Date().toISOString().slice(0,10).replace(/-/g,'');
        const lote = `PROD-${data}-${random}`;

        const produto = {
            nome,
            lote,
            quantidade,
            dataProducao: dataProducao || new Date(),
            usuarioId
        };

        return await this.produtoRepo.criarProduto(produto);
    }

    async buscarProdutos() {
        return await this.produtoRepo.buscarProdutos();
    }

    async buscarProdutoPorId(id) {
        return await this.produtoRepo.buscarProdutoPorId(id);
    }

    async atualizarProduto(id, dadosAtualizados) {
        return await this.produtoRepo.atualizarProduto(id, dadosAtualizados);
    }

    async deletarProduto(id) {
        return await this.produtoRepo.deletarProduto(id);
    }

    async buscarProdutoPorLote(lote) {
        const produto = await this.produtoRepo.buscarProdutoPorLote(lote);
        if (!produto) throw new Error("Produto não encontrado para o lote especificado.");
        return produto;
    }
}
