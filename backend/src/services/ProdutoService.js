export class ProdutoService {
    constructor(produtoRepo) {
        this.produtoRepo = produtoRepo;
    }

    async criarProduto({ nome, quantidade, usuarioId }) {
        if (!nome || quantidade == null) {
            throw new Error("Nome e quantidade são obrigatórios.");
        }

        const produto = {
            nome,
            quantidade,
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
}
