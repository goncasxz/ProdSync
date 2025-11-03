export class ProdutoService {
    constructor(produtoRepo, usuarioService) {
        this.produtoRepo = produtoRepo;
        this.usuarioService = usuarioService;
    }

    async criarProduto({ nome, quantidade, dataProducao, usuarioId }) {
        const random = Math.floor(1000 + Math.random() * 9000);
        const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
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
        if (!id) throw new Error("ID do produto é obrigatório.");

        const produto = await this.produtoRepo.buscarProdutoPorId(id);
        if (!produto) throw new Error("Produto não encontrado.");
        return produto;
    }

    async atualizarProduto(id, dadosAtualizados) {
        if (!id) throw new Error("ID do produto é obrigatório.");
        if (!dadosAtualizados || Object.keys(dadosAtualizados).length === 0) {
            throw new Error("Dados para atualização não podem ser vazios.");
        }

        const produto = await this.produtoRepo.buscarProdutoPorId(id);
        if (!produto) throw new Error("Produto não encontrado.");

        return await this.produtoRepo.atualizarProduto(id, dadosAtualizados);
    }

    async deletarProduto(id) {
        if (!id) throw new Error("ID do produto é obrigatório.");

        const produto = await this.produtoRepo.buscarProdutoPorId(id);
        if (!produto) throw new Error("Produto não encontrado.");

        return await this.produtoRepo.deletarProduto(id);
    }

    async buscarProdutoPorLote(lote) {
        if (!lote) throw new Error("Lote é obrigatório.");

        const produto = await this.produtoRepo.buscarProdutoPorLote(lote);
        if (!produto) throw new Error("Produto não encontrado para o lote especificado.");
        return produto;
    }
}
