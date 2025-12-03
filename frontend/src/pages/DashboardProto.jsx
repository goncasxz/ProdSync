import React from "react";
import "./dashboard.css";

const MENU_ITEMS = [
  { key: "produtos",       title: "Produtos",          sub: "Cadastros • Produtos" },
  { key: "cupons",         title: "Cupons/Voucher",    sub: "Cadastros • Cupons/Voucher" },
  { key: "fornecedores",   title: "Fornecedores",      sub: "Cadastros • Fornecedores" },
  { key: "clientes",       title: "Clientes",          sub: "Cadastros • Clientes" },
  { key: "grupo-usuarios", title: "Grupo de usuários", sub: "Usuários • Grupo de usuários" },
  { key: "usuarios",       title: "Usuários",          sub: "Cadastros • Usuários" },
  { key: "plano-contas",   title: "Plano de contas",   sub: "Financeiro • Plano de contas" },
  { key: "cfops",          title: "CFOP's",            sub: "Fiscal • CFOP's" },
];

const SECTION_ITEMS = {
  operacional: [
    { key: "entrada-produto",   title: "Entrada de matéria prima", sub: "Operacional" },
    { key: "cadastro-produtos", title: "Cadastro de produtos",     sub: "Operacional" },
  ],
  financeiro: [
    { key: "estoque-produtos",  title: "Estoque de produtos",      sub: "Estoque" },
  ],
  fiscal: [
    { key: "exec-producao",     title: "Produção",                 sub: "Produção" },
  ],
  relatorios: [
    { key: "rastrear-produtos", title: "Rastrear produtos",        sub: "Rastreabilidade" },
  ],
  mensagens: [],
  config: [
    { key: "configuracoes",    title: "Tema (Claro / Escuro)", sub: "Configurações" },
    { key: "usuarios-sistema", title: "Usuários do sistema",   sub: "Configurações" },
  ],
};

const ALL_FAVORITABLE = [
  ...MENU_ITEMS,
  ...Object.values(SECTION_ITEMS).flat(),
];

const RAIL = [
  { key: "operacional", icon: "📦", label: "Operacional",     opensModal: false },
  { key: "financeiro",  icon: "💰", label: "Estoque",         opensModal: false },
  { key: "fiscal",      icon: "🧾", label: "Produção",        opensModal: false },
  { key: "relatorios",  icon: "📊", label: "Rastreabilidade", opensModal: false },
  { key: "config",      icon: "⚙️", label: "Configurações",   opensModal: false },
];

export default function DashboardProto() {
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem("ps_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("ps_theme", theme);
    } catch {}
  }, [theme]);

  const [selectedRail, setSelectedRail] = React.useState("operacional");
  const [modal, setModal] = React.useState(null); // { key, title }

  const openModal  = (key, title) => setModal({ key, title });
  const closeModal = () => setModal(null);

  const currentLabel = (RAIL.find(r => r.key === selectedRail)?.label) || "";

  return (
    <div className={`dash-root theme-${theme}`}>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <img
            src="/ChatGPT_Image_16_de_nov._de_2025__14_31_56-removebg-preview.png"
            className="brand-logo"
            alt="ProdSync"
          />

          <div className="env-wrapper">
            <div className="env-chip">Filial: MATRIZ</div>
          </div>
        </div>
      </header>

      <div className="dash-body">
        {/* Rail */}
        <nav className="rail">
          {RAIL.map(({ key, icon, label, opensModal }) => (
            <button
              key={key}
              className={`rail-item ${selectedRail === key ? "active" : ""}`}
              title={label}
              onClick={() => {
                setSelectedRail(key);
                if (opensModal) openModal(key, label);
              }}
            >
              <div className="rail-icon">{icon}</div>
              <div className="rail-label">{label}</div>
            </button>
          ))}
        </nav>

        {/* Lateral */}
        <aside className="side">
          <div className="side-head">{currentLabel}</div>
          <ul className="side-list">
            {(SECTION_ITEMS[selectedRail] ?? []).length === 0 ? (
              <li className="side-empty">
                Nenhuma função nesta seção por enquanto.
              </li>
            ) : (
              SECTION_ITEMS[selectedRail].map((m) => (
                <li key={m.key} className="side-item">
                  <div
                    className="side-click"
                    onClick={() => openModal(m.key, m.title)}
                  >
                    <div className="side-item-title">{m.title}</div>
                    <div className="side-item-sub">{m.sub}</div>
                  </div>
                  <button
                    className="ghost-btn"
                    onClick={() => openModal(m.key, m.title)}
                  >
                    Abrir
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Conteúdo central */}
        <main className="content">
            <div className="panel-head">
            </div>
      <DashboardHome onNavigate={(key) => openModal(key, "")} />
        </main>
      </div>

      {modal && (
        <Modal onClose={closeModal} title={modal.title}>
          {modal.key === "entrada-produto" ? (
            <EntradaProdutoForm onClose={closeModal} />
          ) : modal.key === "cadastro-produtos" ? (
            <CadastroProdutos onClose={closeModal} />
          ) : modal.key === "exec-producao" ? (
            <ExecProducao onClose={closeModal} />
          ) : modal.key === "estoque-produtos" ? (
            <Estoque onClose={closeModal} />
          ) : modal.key === "rastrear-produtos" ? (
            <Rastreabilidade onClose={closeModal} />
          ) : modal.key === "configuracoes" ? (
            <ConfigTheme theme={theme} onChangeTheme={setTheme} />
          ) : modal.key === "usuarios-sistema" ? (
            <UsuariosSistema onClose={closeModal} />
          ) : (
            <div>Função não encontrada.</div>
          )}
        </Modal>
      )}
    </div>
  );
}



/* ===== Modal genérico ===== */
function Modal({ title, onClose, children }) {
  React.useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-window" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} title="Fechar">
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-foot">
          <button className="btn small" onClick={onClose}>
            Fechar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
import { api } from "../services/api"; // Ajuste o caminho conforme sua estrutura

/* ======= COMPONENTE DA TELA INICIAL (DASHBOARD) ======= */
function DashboardHome({ onNavigate }) {
  const [stats, setStats] = React.useState({
    totalProdutos: 0,
    totalMp: 0,
    totalProducao: 0,
    usuarios: 0
  });

  React.useEffect(() => {
    async function fetchStats() {
      try {
        // Busca dados de todas as rotas para contar
        const [resProd, resMp, resProdHist, resUsers] = await Promise.all([
          api.get("/produtos"),
          api.get("/materias-primas"),
          api.get("/producao"),
          api.get("/usuarios")
        ]);

        setStats({
          totalProdutos: resProd.data.produtos?.length || 0,
          totalMp: resMp.data.materiasPrimas?.length || 0,
          totalProducao: resProdHist.data.producoes?.length || 0,
          usuarios: resUsers.data.usuarios?.length || 0
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      }
    }
    fetchStats();
  }, []);

  // Pega o nome do usuário do localStorage para dar "Oi"
  const userName = React.useMemo(() => {
    try {
        const user = JSON.parse(localStorage.getItem("prodsync_user"));
        return user?.nome?.split(" ")[0] || "Visitante";
    } catch { return "Visitante"; }
  }, []);

  const dataHoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Olá, {userName}! 👋</h1>
        <p className="home-subtitle">
          Hoje é {dataHoje}. Aqui está o resumo da sua operação.
        </p>
      </header>

      {/* Grid de Cards KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigate("cadastro-produtos")} style={{cursor: 'pointer'}}>
          <div className="kpi-icon">📦</div>
          <span className="kpi-value">{stats.totalProdutos}</span>
          <span className="kpi-label">Produtos Acabados</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("estoque-produtos")} style={{cursor: 'pointer'}}>
          <div className="kpi-icon">🧱</div>
          <span className="kpi-value">{stats.totalMp}</span>
          <span className="kpi-label">Matérias-Primas</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("exec-producao")} style={{cursor: 'pointer'}}>
          <div className="kpi-icon">🏭</div>
          <span className="kpi-value">{stats.totalProducao}</span>
          <span className="kpi-label">Produções Realizadas</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("usuarios-sistema")} style={{cursor: 'pointer'}}>
          <div className="kpi-icon">👥</div>
          <span className="kpi-value">{stats.usuarios}</span>
          <span className="kpi-label">Usuários Ativos</span>
        </div>
      </div>

      {/* Área de Ação Rápida */}
      <div className="home-shortcuts">
        <h3>🚀 Acesso Rápido</h3>
        <p className="shortcut-text">
          O <strong>ProdSync</strong> está pronto. Utilize o menu lateral para acessar as funções detalhadas ou clique nos cards acima para navegar diretamente.
        </p>
        <div style={{display: 'flex', gap: 10}}>
            <button className="btn small" onClick={() => onNavigate("exec-producao")}>Nova Produção</button>
            <button className="ghost-btn" onClick={() => onNavigate("entrada-produto")}>Entrada de MP</button>
        </div>
      </div>
    </div>
  );
}

/* ======= TELA: ENTRADA DE PRODUTO (INTEGRADA) ======= */

function EntradaProdutoForm({ onClose }) {
  const [item, setItem] = React.useState("");
  const [qtd, setQtd] = React.useState("");
  const [un, setUn] = React.useState("kg");
  const [lote, setLote] = React.useState("");
  const [fab, setFab] = React.useState(""); // Apenas visual por enquanto
  
  const [materias, setMaterias] = React.useState([]); // Lista do banco
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // 1. Busca dados ao abrir a modal
  React.useEffect(() => {
    fetchMaterias();
  }, []);

  async function fetchMaterias() {
    try {
      const res = await api.get("/materias-primas");
      if (res.data.ok) {
        // Ordena pela data de entrada (ID decrescente ou campo dataEntrada se houver)
        // O backend retorna { ok: true, materiasPrimas: [...] }
        const lista = res.data.materiasPrimas.sort((a, b) => b.id - a.id);
        setMaterias(lista);
      }
    } catch (error) {
      console.error("Erro ao buscar matérias-primas", error);
    }
  }

  // 2. Salvar no Backend
  async function handleSave() {
    setErr("");
    setOk("");
    
    if (!item.trim()) return setErr("Informe o nome da matéria-prima.");
    const n = Number(qtd);
    if (!qtd || isNaN(n) || n <= 0) return setErr("Quantidade inválida.");
    if (!un) return setErr("Selecione a unidade.");
    if (!lote.trim()) return setErr("Informe o lote.");

    setLoading(true);

    try {
      // Mapeando campos do Front para o Backend
      const payload = {
        nome: item.trim(),
        quantidade: n,
        unidadeMedida: un,
        lote: lote.trim(),
        // usuarioId é pego automaticamente pelo token no backend? 
        // Se seu controller espera pegar do req.user, não precisa enviar.
        // Se o controller espera no body, precisamos pegar do localStorage.
        // Pelo seu código de backend: const usuarioId = req.user.id; (Está no controller, ok!)
      };

      await api.post("/materias-primas", payload);

      setOk("Matéria-prima registrada com sucesso!");
      
      // Limpa form
      setItem("");
      setQtd("");
      setUn("kg");
      setLote("");
      
      // Atualiza a tabela
      fetchMaterias();

    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar no servidor.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="form-grid form-entrada"
      >
        <div className="field full">
          <label className="label">Item (Nome da MP)</label>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Ex.: Ferro SAE 1020"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">Quantidade</label>
          <input
            type="number"
            step="any"
            value={qtd}
            onChange={(e) => setQtd(e.target.value)}
            placeholder="Ex.: 50"
            disabled={loading}
          />
        </div>
        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={(e) => setUn(e.target.value)} disabled={loading}>
            <option value="t">Toneladas (t)</option>
            <option value="kg">Quilos (kg)</option>
            <option value="g">Gramas (g)</option>
            <option value="mg">Miligramas (mg)</option>
            <option value="un">Unidade (un)</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Lote</label>
          <input
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            placeholder="Ex.: L23-091"
            disabled={loading}
          />
        </div>
        
        {err && <div className="alert error full">{err}</div>}
        {ok && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
            Cancelar (Esc)
          </button>
          <button type="submit" className="btn small" disabled={loading}>
            {loading ? "Salvando..." : "Salvar (F9)"}
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Matérias-primas Cadastradas (Banco)</div>
        {materias.length === 0 ? (
          <div className="side-empty">Nenhum registro encontrado no banco.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>ID</span>
              <span>Item</span>
              <span>Qtd</span>
              <span>Lote</span>
              <span>Entrada</span>
            </div>
            {materias.map((r) => (
              <div key={r.id} className="t-row">
                <span>#{r.id}</span>
                <span>{r.nome}</span>
                <span>{`${r.quantidade} ${r.unidadeMedida}`}</span>
                <span>{r.lote}</span>
                {/* Ajuste de data se necessário */}
                <span>{r.dataEntrada ? new Date(r.dataEntrada).toLocaleDateString() : "-"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= TELA: CADASTRO DE PRODUTOS (AJUSTADA) ======= */

function CadastroProdutos({ onClose }) {
  const [nome, setNome] = React.useState("");
  const [un, setUn] = React.useState("un");
  
  // Lista apenas de Produtos Acabados
  const [listaProdutos, setListaProdutos] = React.useState([]);
  
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");

  // 1. Busca dados (SOMENTE PRODUTOS)
  React.useEffect(() => {
    fetchDados();
  }, []);

  async function fetchDados() {
    try {
      const res = await api.get("/produtos");
      
      // Formata Produtos (PA) do backend
      const produtosPA = (res.data.produtos || []).map(p => ({
        id: p.id,
        nome: p.nome,
        un: "un", // Padrão visual
        saldo: p.quantidade
      }));

      setListaProdutos(produtosPA);

    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    }
  }

  // 2. Salvar
  async function salvar() {
    setErr("");
    setOk("");
    setLoading(true);

    if (!nome.trim()) {
      setLoading(false);
      return setErr("Informe o nome.");
    }

    try {
        await api.post("/produtos", {
          nome: nome.trim(),
          quantidade: 0
        });
        
        setOk(`Produto "${nome}" cadastrado com sucesso.`);
        setNome("");
        setUn("un");
        fetchDados();

    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  // 3. Remover
  async function remover(item) {
    if(!confirm(`Deseja excluir "${item.nome}"?`)) return;
    
    try {
      await api.delete(`/produtos/${item.id}`);
      fetchDados();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erro desconhecido";
      if(errorMsg.includes("Foreign key constraint") || errorMsg.includes("Constraint violation")) {
          alert("Não é possível excluir: Este produto possui histórico de produção.");
      } else {
          alert("Erro ao excluir: " + errorMsg);
      }
    }
  }

  return (
    <div className="modal-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          salvar();
        }}
        className="form-grid form-produto"
      >
        <div className="field full">
          <label className="label">Nome do Item</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Parafuso ou Caixa Acabada"
            disabled={loading}
          />
        </div>

        {/* Tipo removido visualmente pois é fixo */}

        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={(e) => setUn(e.target.value)} disabled={loading}>
            <option value="un">Unidade (un)</option>
            <option value="kg">Quilos (kg)</option>
            <option value="t">Toneladas (t)</option>
            <option value="g">Gramas (g)</option>
          </select>
        </div>

        {/* Aviso Fixo em 1 linha (nowrap) */}
        <div className="field full info-text" style={{
            fontSize: '0.85rem', 
            color: '#888', 
            fontStyle: 'italic', 
            marginTop: '10px',
            whiteSpace: 'nowrap',       // Força 1 linha
            overflow: 'hidden',         // Esconde excesso se a tela for pequena
            textOverflow: 'ellipsis'    // Coloca ... se cortar
        }}>
            ℹ️ Produtos começam com estoque 0. Use a tela de Produção para gerar estoque.
        </div>

        {err && <div className="alert error full">{err}</div>}
        {ok && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
            Fechar
          </button>
          <button type="submit" className="btn small" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Produto"}
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Produtos Cadastrados</div>
        {listaProdutos.length === 0 ? (
          <div className="side-empty">Nenhum produto cadastrado.</div>
        ) : (
          <div className="table-like">
            {/* Grid ajustado: removido coluna Lote */}
            <div className="t-prod-head" style={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr 0.5fr', gap: '10px' }}>
              <span>Nome</span>
              <span>Un</span>
              <span>Saldo Total</span>
              <span>Ações</span>
            </div>
            {listaProdutos.map((p) => (
              <div key={p.id} className="t-prod-row" style={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr 0.5fr', gap: '10px', alignItems: 'center' }}>
                
                <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontWeight: '500'
                }} title={p.nome}>
                    {p.nome}
                </span>

                <span>{p.un}</span>
                
                <span style={{ fontWeight: 'bold' }}>{p.saldo}</span>
                
                <span>
                  <button
                    className="ghost-btn"
                    onClick={() => remover(p)}
                    title="Excluir"
                    type="button"
                  >
                    🗑️
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= TELA: EXECUÇÃO DE PRODUÇÃO (MÚLTIPLAS MPs + VALIDAÇÃO INTEGRADO) ======= */

function ExecProducao({ onClose }) {
  // Dados do Backend
  const [listaPA, setListaPA] = React.useState([]);
  const [listaMP, setListaMP] = React.useState([]);
  const [historicoProducao, setHistoricoProducao] = React.useState([]);

  // Estados do Formulário (Produto Acabado)
  const [produtoPaId, setProdutoPaId] = React.useState("");
  const [qtdPa, setQtdPa] = React.useState("");

  // Estados Temporários (Para adicionar MP na lista)
  const [mpSelecionadaId, setMpSelecionadaId] = React.useState("");
  const [qtdMpInput, setQtdMpInput] = React.useState("");

  // Lista Final de MPs que serão enviadas
  const [mpsParaConsumo, setMpsParaConsumo] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");

  // 1. Carregar dados ao abrir
  React.useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [resProd, resMp, resHist] = await Promise.all([
        api.get("/produtos"),        
        api.get("/materias-primas"), 
        api.get("/producao")         
      ]);

      setListaPA(resProd.data.produtos || []);
      setListaMP(resMp.data.materiasPrimas || []);
      setHistoricoProducao(resHist.data.producoes || []);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setErr("Falha ao carregar listas do servidor.");
    }
  }

  // --- Função auxiliar de validação de input ---
  const handlePositiveInput = (setter) => (e) => {
    const val = e.target.value;
    // Permite vazio (para apagar) ou números positivos
    if (val === "" || Number(val) >= 0) {
      setter(val);
    }
  };

  // 2. Função para Adicionar MP na lista temporária
  function adicionarMpNaLista() {
    setErr("");
    
    if (!mpSelecionadaId) return setErr("Selecione uma matéria-prima.");
    const qtd = Number(qtdMpInput);
    
    // Validação extra antes de adicionar
    if (!qtd || qtd <= 0) return setErr("Informe uma quantidade válida (maior que zero).");

    // Verifica se já adicionou essa MP para não duplicar
    const jaExiste = mpsParaConsumo.find(item => item.id === Number(mpSelecionadaId));
    if (jaExiste) {
      return setErr("Esta matéria-prima já está na lista. Remova-a se quiser corrigir a quantidade.");
    }

    // Busca os detalhes da MP
    const mpDetalhes = listaMP.find(m => m.id === Number(mpSelecionadaId));

    const novoItem = {
      id: mpDetalhes.id,
      nome: mpDetalhes.nome,
      lote: mpDetalhes.lote,
      unidade: mpDetalhes.unidadeMedida,
      quantidadeUsada: qtd
    };

    setMpsParaConsumo([...mpsParaConsumo, novoItem]);
    
    // Limpa os campos de seleção de MP
    setMpSelecionadaId("");
    setQtdMpInput("");
  }

  // 3. Remover MP da lista temporária
  function removerMpDaLista(idParaRemover) {
    setMpsParaConsumo(mpsParaConsumo.filter(item => item.id !== idParaRemover));
  }

  // 4. Enviar Produção (Payload Final)
  async function handleProduzir(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    // Validações Gerais
    if (!produtoPaId) return setErr("Selecione o produto acabado.");
    if (!qtdPa || Number(qtdPa) <= 0) return setErr("Informe a quantidade a produzir.");
    
    // Validação da Lista de MPs
    if (mpsParaConsumo.length === 0) {
      return setErr("Adicione pelo menos uma matéria-prima para a receita.");
    }

    setLoading(true);

    try {
      const listaFormatadaBackend = mpsParaConsumo.map(item => ({
        id: item.id,
        quantidadeUsada: item.quantidadeUsada
      }));

      const payload = {
        produtoId: Number(produtoPaId),
        quantidadeProduzida: Number(qtdPa),
        materiasPrimas: listaFormatadaBackend
      };

      const response = await api.post("/producao", payload);

      setOk(`Produção registrada! Lote: ${response.data.lote}`);
      
      // Reset total do formulário
      setQtdPa("");
      setMpsParaConsumo([]); // Limpa a lista de MPs
      
      carregarDados();

    } catch (apiError) {
      console.error(apiError);
      const msg = apiError.response?.data?.error || "Erro ao registrar produção.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-form">
      <form onSubmit={handleProduzir} className="form-grid form-producao">
        
        {/* === SEÇÃO 1: O QUE VAI SER PRODUZIDO (PA) === */}
        <div className="field full">
          <label className="label">Produto Acabado (Entrada)</label>
          <select
            value={produtoPaId}
            onChange={(e) => setProdutoPaId(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecione...</option>
            {listaPA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} (Saldo atual: {p.quantidade})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Qtd a Produzir</label>
          <input
            type="number"
            step="any"
            min="0" // Ajuda visual do navegador
            value={qtdPa}
            onChange={handlePositiveInput(setQtdPa)} // Bloqueia digitação negativa
            placeholder="Ex.: 10"
            disabled={loading}
          />
        </div>

        {/* === SEÇÃO 2: ADICIONAR MPs (Staging Area) === */}
        <div className="field full" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', alignItems: 'end', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '6px' }}>
            <div>
                <label className="label">Selecione a MP</label>
                <select
                    value={mpSelecionadaId}
                    onChange={(e) => setMpSelecionadaId(e.target.value)}
                    disabled={loading}
                    style={{width: '100%'}}
                >
                    <option value="">Selecione...</option>
                    {listaMP.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.nome} (Lote: {m.lote} | Disp: {m.quantidade} {m.unidadeMedida})
                    </option>
                    ))}
                </select>
            </div>
            
            <div>
                <label className="label">Qtd Usada</label>
                <input
                    type="number"
                    step="any"
                    min="0" // Ajuda visual
                    value={qtdMpInput}
                    onChange={handlePositiveInput(setQtdMpInput)} // Bloqueia digitação negativa
                    placeholder="0"
                    disabled={loading}
                    style={{width: '100%'}}
                />
            </div>

            <button 
                type="button" 
                className="btn small" 
                onClick={adicionarMpNaLista}
                disabled={loading}
                style={{marginBottom: '2px'}}
            >
                + Adicionar
            </button>
        </div>

        {/* === SEÇÃO 3: LISTA DE MPs ADICIONADAS === */}
        {mpsParaConsumo.length > 0 && (
            <div className="field full">
                <div className="table-like" style={{maxHeight: '150px', overflowY: 'auto'}}>
                    <div className="t-head" style={{gridTemplateColumns: '2fr 1fr 1fr 0.5fr'}}>
                        <span>Matéria-Prima</span>
                        <span>Lote</span>
                        <span>Qtd</span>
                        <span></span>
                    </div>
                    {mpsParaConsumo.map((item) => (
                        <div key={item.id} className="t-row" style={{gridTemplateColumns: '2fr 1fr 1fr 0.5fr'}}>
                            <span>{item.nome}</span>
                            <span>{item.lote}</span>
                            <span style={{color: '#e53935'}}>-{item.quantidadeUsada} {item.unidade}</span>
                            <button 
                                type="button" 
                                className="ghost-btn" 
                                onClick={() => removerMpDaLista(item.id)}
                                title="Remover"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {err && <div className="alert error full">{err}</div>}
        {ok && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
            Fechar
          </button>
          <button type="submit" className="btn small" disabled={loading || mpsParaConsumo.length === 0}>
            {loading ? "Processando..." : "Confirmar Produção"}
          </button>
        </div>
      </form>

      {/* Histórico Abaixo (Visualização Apenas) */}
      <div className="recent-card">
        <div className="recent-head">Histórico Recente</div>
        {historicoProducao.length === 0 ? (
          <div className="side-empty">Nenhuma produção registrada.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Produto</span>
              <span>Lote</span>
              <span>Qtd</span>
              <span>MPs</span>
            </div>
            {historicoProducao.slice(0, 5).map((p) => (
              <div key={p.id} className="t-row">
                <span>{p.produto?.nome}</span>
                <span>{p.lote}</span>
                <span style={{ color: "#4caf50" }}>+{p.quantidadeProduzida}</span>
                <span style={{fontSize: '0.8rem'}}>
                    {p.materiasPrimasUsadas?.length || 0} itens
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= CONFIGURAÇÕES: TEMA ======= */
function ConfigTheme({ theme, onChangeTheme }) {
  return (
    <div className="modal-form">
      <h3 className="config-title">Aparência</h3>
      <p className="config-subtitle">
        Escolha como o ProdSync será exibido neste dispositivo.
      </p>

      <div className="theme-options">
        <button
          type="button"
          className={`theme-card ${theme === "dark" ? "active" : ""}`}
          onClick={() => onChangeTheme("dark")}
        >
          <div className="theme-dot theme-dot-dark" />
          <div className="theme-card-text">
            <span className="theme-card-title">Modo escuro</span>
            <span className="theme-card-desc">
              Fundo escuro, ideal para uso prolongado.
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`theme-card ${theme === "light" ? "active" : ""}`}
          onClick={() => onChangeTheme("light")}
        >
          <div className="theme-dot theme-dot-light" />
          <div className="theme-card-text">
            <span className="theme-card-title">Modo claro</span>
            <span className="theme-card-desc">
              Fundo claro, mais próximo de sistemas padrão.
            </span>
          </div>
        </button>
      </div>

      <p className="config-hint">
        O tema selecionado fica salvo no navegador e será aplicado sempre que
        você abrir o ProdSync.
      </p>
    </div>
  );
}

/* ======= TELA: ESTOQUE (INTEGRADA) ======= */
function Estoque({ onClose }) {
  const [itens, setItens] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtroTipo, setFiltroTipo] = React.useState("todos"); // todos | mp | pa

  React.useEffect(() => {
    fetchEstoque();
  }, []);

  async function fetchEstoque() {
    try {
      setLoading(true);
      const [resProd, resMp] = await Promise.all([
        api.get("/produtos"),
        api.get("/materias-primas")
      ]);

      // Formata Produtos Acabados (PA)
      // No backend, Produto = SKU único com saldo total
      const listaPA = (resProd.data.produtos || []).map(p => ({
        uniqueId: `PA-${p.id}`,
        nome: p.nome,
        tipo: "pa",
        un: "un", // Assumindo padrão, já que o model Produto não tem unidade
        lote: "Saldo Total", // PA no banco é agrupado
        saldo: p.quantidade
      }));

      // Formata Matérias-Primas (MP)
      // No backend, cada entrada de MP é um registro com lote
      const listaMP = (resMp.data.materiasPrimas || []).map(m => ({
        uniqueId: `MP-${m.id}`,
        nome: m.nome,
        tipo: "mp",
        un: m.unidadeMedida,
        lote: m.lote,
        saldo: m.quantidade
      }));

      // Junta tudo
      setItens([...listaPA, ...listaMP]);

    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    } finally {
      setLoading(false);
    }
  }

  // Lógica de Filtragem no Frontend
  const itensFiltrados = React.useMemo(() => {
    const term = searchTerm.toLowerCase();
    
    return itens.filter(item => {
      // 1. Filtro por Tipo
      if (filtroTipo !== "todos" && item.tipo !== filtroTipo) return false;

      // 2. Busca por Nome ou Lote
      const matchNome = item.nome.toLowerCase().includes(term);
      const matchLote = item.lote.toLowerCase().includes(term);
      
      return matchNome || matchLote;
    });
  }, [itens, searchTerm, filtroTipo]);

  return (
    <div className="modal-form">
      {/* --- ÁREA DE FILTROS --- */}
      <div className="form-grid form-estoque-filtros">
        <div className="field full">
          <label className="label">Pesquisar (Nome ou Lote)</label>
          <input
            placeholder="Digite para filtrar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Mostrar</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os Itens</option>
            <option value="mp">Matérias-primas</option>
            <option value="pa">Produtos Acabados</option>
          </select>
        </div>
        
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          
          {/* 2. Flexbox: Centraliza o botão horizontalmente no espaço disponível */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button 
              type="button" 
              className="btn small" 
              onClick={fetchEstoque} 
              title="Atualizar Lista"
            >
              🔄 Atualizar Lista de Estoque
            </button>
          </div>
        </div>
      </div>

      {/* --- TABELA DE ESTOQUE --- */}
      <div className="recent-card">
        <div className="recent-head">
          Posição de Estoque
          {loading && <span style={{fontSize: '0.8rem', fontWeight: 'normal', marginLeft: 10}}> (Carregando...)</span>}
        </div>

        {!loading && itensFiltrados.length === 0 ? (
          <div className="side-empty">
            Nenhum item encontrado.
          </div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span>
              <span>Tipo</span>
              <span>Lote</span>
              <span>Saldo</span>
              <span>Un</span>
            </div>

            {itensFiltrados.map((item) => (
              <div
                key={item.uniqueId}
                className="t-prod-row"
                style={{ 
                    borderLeft: item.tipo === 'mp' ? '4px solid #ff9800' : '4px solid #4caf50' 
                }}
              >
                <span style={{fontWeight: 'bold'}}>{item.nome}</span>
                <span>
                  {item.tipo === "mp" ? "Matéria-prima" : "Produto Acabado"}
                </span>
                <span>{item.lote}</span>
                <span style={{
                    color: item.saldo > 0 ? 'inherit' : '#e53935',
                    fontWeight: item.saldo > 0 ? 'normal' : 'bold'
                }}>
                    {item.saldo}
                </span>
                <span>{item.un}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions full" style={{ marginTop: "1rem" }}>
        <button type="button" className="ghost-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

/* ============================
   COMPONENTE: RASTREABILIDADE (INTEGRADO)
   ============================ */

function Rastreabilidade({ onClose }) {
  const [resultados, setResultados] = React.useState(null); // null = sem busca
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState("");

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchField, setSearchField] = React.useState("lotePa"); // lotePa | nome | loteMp

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    setResultados(null);

    const term = searchTerm.trim();
    if (!term) return setErro("Digite um termo para buscar.");

    setLoading(true);

    try {
      let dadosEncontrados = [];

      if (searchField === "lotePa") {
        // === Busca Direta por Lote PA ===
        // Endpoint: GET /producao/lote/:lote
        try {
            const res = await api.get(`/producao/lote/${encodeURIComponent(term)}`);
            dadosEncontrados = res.data.producoes || [];
        } catch (e) {
            // Se der 404 ou 400, apenas retorna vazio
            dadosEncontrados = [];
        }
      } else {
        // === Busca Genérica (Nome ou Lote MP) ===
        // Endpoint: GET /producao (Traz histórico recente)
        const res = await api.get("/producao");
        const todoHistorico = res.data.producoes || [];

        if (searchField === "nome") {
          dadosEncontrados = todoHistorico.filter((p) =>
            (p.produto?.nome || "").toLowerCase().includes(term.toLowerCase())
          );
        } else if (searchField === "loteMp") {
          // Filtra se ALGUMA das MPs usadas tem esse lote
          dadosEncontrados = todoHistorico.filter((p) =>
            p.materiasPrimasUsadas.some((item) =>
              (item.materiaPrima?.lote || "").toLowerCase().includes(term.toLowerCase())
            )
          );
        }
      }

      setResultados(dadosEncontrados);
    } catch (err) {
      console.error(err);
      setErro("Erro ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-form">
      <h3 className="config-title">Rastreabilidade de Produção</h3>
      <p className="config-subtitle">
        Localize a origem de um lote ou onde uma matéria-prima foi utilizada.
      </p>

      {/* --- FORMULÁRIO DE BUSCA --- */}
      <form className="form-grid form-estoque-filtros" onSubmit={handleBuscar}>
        <div className="field full">
          <label className="label">Termo de Busca</label>
          <input
            placeholder={
              searchField === "lotePa"
                ? "Ex: L-PA-2025-0001"
                : searchField === "loteMp"
                ? "Ex: L23-091"
                : "Ex: Mesa"
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">Pesquisar por</label>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            disabled={loading}
          >
            <option value="lotePa">Lote do Produto (PA)</option>
            <option value="loteMp">Lote da Matéria-prima (MP)</option>
            <option value="nome">Nome do Produto</option>
          </select>
        </div>

        <div className="actions" style={{ alignSelf: "flex-end" }}>
          <button type="submit" className="btn small" disabled={loading}>
            {loading ? "Buscando..." : "Rastrear"}
          </button>
        </div>
      </form>

      {erro && <div className="alert error full" style={{marginTop: 10}}>{erro}</div>}

      {/* --- RESULTADOS --- */}
      <div className="recent-card" style={{ marginTop: "1rem" }}>
        <div className="recent-head">
            Resultado da Rastreabilidade
            {resultados && <span style={{marginLeft: 10, fontSize: '0.8rem'}}>({resultados.length} encontrados)</span>}
        </div>

        {resultados === null ? (
          <div className="side-empty">Utilize os filtros acima para iniciar.</div>
        ) : resultados.length === 0 ? (
          <div className="side-empty">Nenhum registro encontrado para "{searchTerm}".</div>
        ) : (
          <div className="table-like">
            {resultados.map((prod) => (
              <div key={prod.id} className="trace-card" style={{
                  background: 'var(--bg-card)', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  borderRadius: '4px',
                  border: '1px solid var(--border)'
              }}>
                {/* Cabeçalho do Card de Rastreio */}
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '5px'}}>
                    <span style={{fontWeight: 'bold', color: 'var(--accent)'}}>{prod.lote}</span>
                    <span style={{fontSize: '0.85rem'}}>{new Date(prod.dataProducao).toLocaleString()}</span>
                </div>
                
                {/* Corpo do Card */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem'}}>
                    <div>
                        <strong>Produto:</strong> {prod.produto?.nome}<br/>
                        <strong>Quantidade:</strong> {prod.quantidadeProduzida}
                    </div>
                    <div>
                        <strong>Responsável:</strong> {prod.usuario?.nome || "Admin"}<br/>
                        <strong>ID Produção:</strong> #{prod.id}
                    </div>
                </div>

                {/* Sub-lista de MPs usadas */}
                <div style={{marginTop: '8px', background: 'rgba(0,0,0,0.05)', padding: '5px', borderRadius: '4px'}}>
                    <strong style={{fontSize: '0.8rem'}}>Matérias-Primas Utilizadas:</strong>
                    {prod.materiasPrimasUsadas.map(mpUso => (
                        <div key={mpUso.id} style={{fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginTop: '2px'}}>
                            <span>• {mpUso.materiaPrima?.nome} (Lote: {mpUso.materiaPrima?.lote})</span>
                            <span>Qtd: {mpUso.quantidadeUsada} {mpUso.materiaPrima?.unidadeMedida}</span>
                        </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="actions full" style={{ marginTop: "1rem" }}>
        <button className="ghost-btn" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

/* ======= TELA: USUÁRIOS DO SISTEMA (ATUALIZADA) ======= */

function UsuariosSistema({ onClose }) {
  const [listaUsuarios, setListaUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  // Form States
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  // Inicia como USER para o select não ficar visualmente vazio
  const [tipo, setTipo] = React.useState("USER"); 

  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");

  // Pega o ID do usuário logado para impedir auto-exclusão
  const currentUserId = React.useMemo(() => {
    try {
        const stored = JSON.parse(localStorage.getItem("prodsync_user"));
        return stored?.usuario?.id; // Ajuste conforme a estrutura que você salvou no login
    } catch {
        return null;
    }
  }, []);

  // 1. Carregar lista de usuários
  React.useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const res = await api.get("/usuarios");
      if (res.data.ok) {
        // Ordena por ID para o Admin (1) ficar sempre no topo
        const sorted = res.data.usuarios.sort((a, b) => a.id - b.id);
        setListaUsuarios(sorted);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      if (error.response?.status === 403) {
        setErr("Você não tem permissão para visualizar usuários (Apenas Admin).");
      }
    }
  }

  // 2. Salvar Usuário
  async function salvarUsuario() {
    // Limpa mensagens anteriores
    setErr("");
    setOk("");

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      return setErr("Preencha todos os campos obrigatórios.");
    }

    setLoading(true);

    try {
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim(),
        tipoAcesso: tipo // Já inicia com valor válido
      };

      await api.post("/usuarios", payload);

      setOk(`Usuário "${nome}" criado com sucesso.`);
      
      // Limpa form
      setNome("");
      setEmail("");
      setSenha("");
      setTipo("USER");

      // Atualiza lista
      fetchUsuarios();

    } catch (apiError) {
      const msg = apiError.response?.data?.error || "Erro ao criar usuário.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  // 3. Deletar Usuário (Com Regras de Bloqueio)
  async function deletar(usuarioAlvo) {
    // Limpa mensagens anteriores imediatamente
    setErr("");
    setOk("");

    const id = usuarioAlvo.id;
    const nomeAlvo = usuarioAlvo.nome;

    // REGRA 1: Não excluir o Admin Principal (ID 1)
    if (id === 1) {
        setErr("Bloqueado: Não é possível excluir o Administrador Principal (ID #1).");
        return;
    }

    // REGRA 2: Não excluir a si mesmo
    if (id === currentUserId) {
        setErr("Bloqueado: Você não pode excluir seu próprio usuário enquanto está logado.");
        return;
    }

    if(!confirm(`Tem certeza que deseja remover o usuário "${nomeAlvo}"?`)) return;

    try {
        await api.delete(`/usuarios/${id}`);
        setOk(`Usuário "${nomeAlvo}" removido com sucesso.`);
        fetchUsuarios();
    } catch (e) {
        const msg = e.response?.data?.error || "Erro desconhecido ao deletar.";
        setErr(`Erro ao deletar: ${msg}`);
    }
  }

  return (
    <div className="modal-form">
      <h3 className="config-title">Gerenciar Usuários</h3>
      <p className="config-subtitle">Cadastre operadores e administradores do sistema.</p>

      <div className="form-grid">
        <div className="field">
          <label className="label">Nome</label>
          <input 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="João Silva"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">E-mail (Login)</label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="joao@empresa.com"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="******"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">Tipo de Acesso</label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
            disabled={loading}
          >
            <option value="USER">Usuário Comum</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {/* Exibe mensagens de feedback */}
        {err && <div className="alert error full">{err}</div>}
        {ok && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button
            className="primary-btn"
            style={{ width: '100%', padding: '10px', marginTop: '10px', background: 'green', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            type="button"
            onClick={salvarUsuario}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Cadastrar Usuário"}
          </button>
        </div>
      </div>

      <div className="recent-card" style={{ marginTop: "1rem" }}>
        <div className="recent-head">Usuários Cadastrados</div>

        {listaUsuarios.length === 0 ? (
          <div className="side-empty">Nenhum usuário encontrado.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>ID</span>
              <span>Nome</span>
              <span>Email</span>
              <span>Tipo</span>
              <span>Ação</span>
            </div>

            {listaUsuarios.map((u) => (
              <div key={u.id} className="t-row" style={{ alignItems: 'center' }}>
                <span>#{u.id}</span>
                <span>{u.nome}</span>
                
                {/* Estilo para evitar que email longo quebre o layout */}
                <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    maxWidth: '100%' 
                }} title={u.email}>
                    {u.email}
                </span>

                <span>
                      {u.tipoAcesso && u.tipoAcesso.toUpperCase() === "ADMIN" 
                        ? <span style={{color: 'red', fontWeight: 'bold'}}>ADMIN</span> 
                        : "USER"}
                </span>
                
                <span>
                    {/* Botão desabilitado visualmente se for ID 1 ou próprio usuário, mas a lógica no onClick também protege */}
                    <button 
                        className="ghost-btn" 
                        onClick={() => deletar(u)} 
                        title="Excluir"
                        style={{ 
                            opacity: (u.id === 1 || u.id === currentUserId) ? 0.3 : 1,
                            cursor: (u.id === 1 || u.id === currentUserId) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🗑️
                    </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions full" style={{ marginTop: "1rem" }}>
        <button className="ghost-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

