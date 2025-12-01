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
  {/* Logo transparente */}
      <img
        src="/ChatGPT_Image_16_de_nov._de_2025__14_31_56-removebg-preview.png"
        alt="ProdSync"
        className="welcome-logo"
      />

      {/* Título */}
      <h2 className="welcome-title">Bem-vindo ao ProdSync</h2>

      {/* Frase clichê bonita */}
      <p className="welcome-phrase">
        Produtividade não é sobre fazer mais — é sobre fazer melhor.
      </p>

      {/* Subdescrição */}
      <p className="welcome-sub">
        Selecione uma função no menu lateral para começar.
      </p>
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

/* ======= TELA: ENTRADA DE PRODUTO (INTEGRADA) ======= */
import { api } from "../services/api"; // Ajuste o caminho conforme sua estrutura

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
      setFab(""); // Fabricante não foi enviado pois não tem no Model
      
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
        
        {/* Campo visual apenas, backend não suporta Fabricante ainda */}
        <div className="field">
          <label className="label">Fabricante (Visual)</label>
          <input
            value={fab}
            onChange={(e) => setFab(e.target.value)}
            placeholder="Ex.: Aço Brasil S.A."
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

/* ======= TELA: CADASTRO DE PRODUTOS (INTEGRADA) ======= */

function CadastroProdutos({ onClose }) {
  const [nome, setNome] = React.useState("");
  const [un, setUn] = React.useState("un");
  const [tipo, setTipo] = React.useState("pa"); // pa (Produto) ou mp (Matéria Prima)
  
  // Campos extras se for MP (pois o backend exige lote/qtd na criação de MP)
  const [loteMp, setLoteMp] = React.useState("");
  const [qtdMp, setQtdMp] = React.useState("");

  const [listaUnificada, setListaUnificada] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");

  // 1. Busca dados de Produtos e MPs para exibir na tabela
  React.useEffect(() => {
    fetchDados();
  }, []);

  async function fetchDados() {
    try {
      // Faz as duas requisições em paralelo
      const [resProd, resMp] = await Promise.all([
        api.get("/produtos"),
        api.get("/materias-primas")
      ]);

      // Formata Produtos (PA) do backend
      const produtosPA = (resProd.data.produtos || []).map(p => ({
        id: `PA-${p.id}`, // ID visual para diferenciar
        realId: p.id,
        nome: p.nome,
        un: "un", // O backend Produto não tem campo unidade, assumindo 'un'
        tipo: "pa",
        saldo: p.quantidade,
        lote: "-" // Produto no backend é somatório, o lote é gerado na Produção
      }));

      // Formata Matérias-Primas (MP) do backend
      const materiasMP = (resMp.data.materiasPrimas || []).map(m => ({
        id: `MP-${m.id}`,
        realId: m.id,
        nome: m.nome,
        un: m.unidadeMedida,
        tipo: "mp",
        saldo: m.quantidade,
        lote: m.lote
      }));

      // Junta as listas
      setListaUnificada([...produtosPA, ...materiasMP]);

    } catch (error) {
      console.error("Erro ao buscar dados", error);
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
      // Pega o ID do usuário (necessário para alguns endpoints se não pegar do token)
      // O seu backend controller pega do req.user.id (AuthMiddleware), então o body é mais limpo.
      
      if (tipo === "pa") {
        // === Cadastrar PRODUTO ACABADO ===
        // Endpoint: POST /produtos
        // Body esperado: { nome, quantidade } (UsuarioID vem do token)
        
        await api.post("/produtos", {
          nome: nome.trim(),
          quantidade: 0 // Começa com 0, aumenta via Produção
        });
        
        setOk(`Produto "${nome}" cadastrado com sucesso.`);

      } else {
        // === Cadastrar MATÉRIA-PRIMA ===
        // Endpoint: POST /materias-primas
        if (!loteMp.trim() || !qtdMp) {
          setLoading(false);
          return setErr("Para MP, informe Lote e Quantidade Inicial.");
        }

        await api.post("/materias-primas", {
          nome: nome.trim(),
          quantidade: Number(qtdMp),
          unidadeMedida: un,
          lote: loteMp.trim()
        });

        setOk(`Matéria-prima "${nome}" cadastrada com sucesso.`);
      }

      // Limpa formulário
      setNome("");
      setLoteMp("");
      setQtdMp("");
      
      // Atualiza tabela
      fetchDados();

    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  // Função auxiliar para deletar (opcional, se tiver endpoint)
  async function remover(item) {
    if(!confirm("Deseja realmente excluir?")) return;
    
    try {
      if (item.tipo === "pa") {
        await api.delete(`/produtos/${item.realId}`);
      } else {
        await api.delete(`/materias-primas/${item.realId}`);
      }
      fetchDados();
    } catch (error) {
      alert("Erro ao excluir: " + (error.response?.data?.error || "Erro desconhecido"));
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

        <div className="field">
          <label className="label">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} disabled={loading}>
            <option value="pa">Produto Acabado</option>
            <option value="mp">Matéria-prima</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={(e) => setUn(e.target.value)} disabled={loading}>
            <option value="un">Unidade (un)</option>
            <option value="kg">Quilos (kg)</option>
            <option value="t">Toneladas (t)</option>
            <option value="g">Gramas (g)</option>
          </select>
        </div>

        {/* Campos condicionais se for Matéria Prima (Backend exige lote na criação) */}
        {tipo === "mp" && (
          <>
            <div className="field">
              <label className="label">Lote Inicial</label>
              <input
                value={loteMp}
                onChange={(e) => setLoteMp(e.target.value)}
                placeholder="Lote..."
                disabled={loading}
              />
            </div>
            <div className="field">
              <label className="label">Qtd Inicial</label>
              <input
                type="number"
                value={qtdMp}
                onChange={(e) => setQtdMp(e.target.value)}
                placeholder="0"
                disabled={loading}
              />
            </div>
          </>
        )}

        {/* Aviso se for PA */}
        {tipo === "pa" && (
          <div className="field full info-text" style={{fontSize: '0.85rem', color: '#888', fontStyle: 'italic'}}>
            ℹ️ Produtos Acabados começam com estoque 0. Use a tela de <b>Produção</b> para gerar estoque consumindo matéria-prima.
          </div>
        )}

        {err && <div className="alert error full">{err}</div>}
        {ok && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
            Fechar
          </button>
          <button type="submit" className="btn small" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Produtos e MPs Cadastrados</div>
        {listaUnificada.length === 0 ? (
          <div className="side-empty">Nenhum item cadastrado.</div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span>
              <span>Tipo</span>
              <span>Un</span>
              <span>Lote Atual</span>
              <span>Saldo Total</span>
              <span>Ações</span>
            </div>
            {listaUnificada.map((p) => (
              <div key={p.id} className="t-prod-row">
                <span>{p.nome}</span>
                <span>
                  {p.tipo === "mp" ? <span className="badge mp">MP</span> : <span className="badge pa">PA</span>}
                </span>
                <span>{p.un}</span>
                <span>{p.lote}</span>
                <span>{p.saldo}</span>
                <span>
                  <button
                    className="ghost-btn"
                    onClick={() => remover(p)}
                    title="Excluir"
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

/* ======= TELA: EXECUÇÃO DE PRODUÇÃO (INTEGRADA) ======= */
function ExecProducao({ onClose }) {
  // Listas para os Selects
  const [listaPA, setListaPA] = React.useState([]);
  const [listaMP, setListaMP] = React.useState([]);
  const [historicoProducao, setHistoricoProducao] = React.useState([]);

  // Form States
  const [produtoPaId, setProdutoPaId] = React.useState("");
  const [qtdPa, setQtdPa] = React.useState("");
  const [mpId, setMpId] = React.useState(""); // ID da MP selecionada
  const [qtdMp, setQtdMp] = React.useState("");
  
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
        api.get("/produtos"),        // Para popular o select de Produto Acabado
        api.get("/materias-primas"), // Para popular o select de Matéria Prima
        api.get("/producoes")         // Para mostrar a tabela de histórico recente
      ]);

      setListaPA(resProd.data.produtos || []);
      setListaMP(resMp.data.materiasPrimas || []);
      setHistoricoProducao(resHist.data.producoes || []);

    } catch (error) {
      console.error("Erro ao carregar dados de produção:", error);
      setErr("Falha ao carregar listas do servidor.");
    }
  }

  // 2. Enviar Produção
  async function handleProduzir(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!produtoPaId) return setErr("Selecione o produto acabado.");
    if (!qtdPa || Number(qtdPa) <= 0) return setErr("Informe a quantidade a produzir.");
    if (!mpId) return setErr("Selecione a matéria-prima.");
    if (!qtdMp || Number(qtdMp) <= 0) return setErr("Informe a quantidade de MP a consumir.");

    setLoading(true);

    try {
      // Formato exigido pelo Backend (ProducaoController -> ProducaoService)
      const payload = {
        produtoId: Number(produtoPaId),
        quantidadeProduzida: Number(qtdPa),
        // O backend espera um array de matérias-primas
        materiasPrimas: [
          {
            id: Number(mpId),
            quantidadeUsada: Number(qtdMp)
          }
        ]
        // usuarioId é pego automaticamente pelo token no backend
      };

      const response = await api.post("/producoes", payload);

      setOk(`Produção registrada com sucesso! Lote Gerado: ${response.data.lote}`);
      
      // Limpa formulário
      setQtdPa("");
      setQtdMp("");
      
      // Recarrega histórico e saldos (opcional, mas bom para atualizar a UI se tivesse saldo visível)
      carregarDados();

    } catch (apiError) {
      console.error(apiError);
      // Tenta pegar a mensagem específica do backend (ex: "Estoque insuficiente")
      const msg = apiError.response?.data?.error || "Erro ao registrar produção.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-form">
      <form onSubmit={handleProduzir} className="form-grid form-producao">
        
        {/* === ÁREA DO PRODUTO ACABADO === */}
        <div className="field full">
          <label className="label">Produto Acabado (O que vai entrar no estoque)</label>
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
            value={qtdPa}
            onChange={(e) => setQtdPa(e.target.value)}
            placeholder="Ex.: 10"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">Lote (Gerado Automático)</label>
          <input value="Automático pelo Sistema" disabled style={{ color: "#888", fontStyle: "italic" }} />
        </div>

        <div className="field full">
          <hr className="field-separator" />
          <p style={{fontSize: '0.85rem', color: '#aaa', marginBottom: '10px'}}>Consumo de Matéria-Prima</p>
        </div>

        {/* === ÁREA DA MATÉRIA PRIMA === */}
        <div className="field">
          <label className="label">Matéria-prima (O que vai sair)</label>
          <select
            value={mpId}
            onChange={(e) => setMpId(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecione...</option>
            {listaMP.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} (Lote: {m.lote} | Saldo: {m.quantidade} {m.unidadeMedida})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Qtd a Consumir</label>
          <input
            type="number"
            step="any"
            value={qtdMp}
            onChange={(e) => setQtdMp(e.target.value)}
            placeholder="Ex.: 5"
            disabled={loading}
          />
        </div>

        {err && <div className="alert error full">{err}</div>}
        {ok && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose} disabled={loading}>
            Fechar
          </button>
          <button type="submit" className="btn small" disabled={loading}>
            {loading ? "Registrando..." : "Confirmar Produção"}
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Histórico de Produção</div>
        {historicoProducao.length === 0 ? (
          <div className="side-empty">Nenhuma produção registrada.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Data</span>
              <span>Produto</span>
              <span>Lote Gerado</span>
              <span>Qtd Produzida</span>
              <span>Responsável</span>
            </div>
            {historicoProducao.map((p) => (
              <div key={p.id} className="t-row">
                <span>{new Date(p.dataProducao).toLocaleString()}</span>
                <span>{p.produto?.nome || "Produto Deletado"}</span>
                <span>{p.lote}</span>
                <span style={{ color: "#4caf50", fontWeight: "bold" }}>+{p.quantidadeProduzida}</span>
                <span>{p.usuario?.nome || "-"}</span>
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
        
        <div className="field" style={{display: 'flex', alignItems: 'flex-end'}}>
           <button type="button" className="ghost-btn" onClick={fetchEstoque} title="Atualizar Lista">
             🔄 Atualizar
           </button>
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
   COMPONENTE: RASTREABILIDADE
   ============================ */

function Rastreabilidade() {
  const STORAGE_PROD = "translot_produtos";

  // carrega os produtos cadastrados
  const [produtos] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PROD)) ?? [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm]   = React.useState("");
  const [searchField, setSearchField] = React.useState("nome"); // nome | lotePa | loteMp
  const [resultados, setResultados]   = React.useState(null);   // null = ainda não buscou
  const [erro, setErro]               = React.useState("");

  function handleBuscar(e) {
    e.preventDefault();
    setErro("");

    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setErro("Digite um termo para buscar.");
      setResultados(null);
      return;
    }

    let lista = [...produtos];

    if (searchField === "nome") {
      lista = lista.filter((p) =>
        (p.nome || "").toLowerCase().includes(term)
      );
    } else if (searchField === "lotePa") {
      lista = lista.filter((p) =>
        (p.lotePa || "").toLowerCase().includes(term)
      );
    } else if (searchField === "loteMp") {
      lista = lista.filter((p) =>
        (p.mpLote || "").toLowerCase().includes(term)
      );
    }

    setResultados(lista);
  }

  return (
    <div className="modal-form">
      <h3 className="config-title">Rastreabilidade de produtos</h3>
      <p className="config-subtitle">
        Busque por nome ou lote e veja de qual matéria-prima o produto veio.
      </p>

      {/* Filtros, no mesmo estilo da tela de Estoque */}
      <form className="form-grid form-estoque-filtros" onSubmit={handleBuscar}>
        <div className="field full">
          <label className="label">Pesquisar</label>
          <input
            placeholder={
              searchField === "nome"
                ? "Digite o nome do produto..."
                : searchField === "lotePa"
                ? "Digite o lote do produto acabado (PA)..."
                : "Digite o lote da matéria-prima..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Pesquisar por</label>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="nome">Nome do produto</option>
            <option value="lotePa">Lote do produto (PA)</option>
            <option value="loteMp">Lote da matéria-prima</option>
          </select>
        </div>

        <div className="actions" style={{ alignSelf: "flex-end" }}>
          <button type="submit" className="btn small">
            Buscar
          </button>
        </div>
      </form>

      {erro && <div className="alert error" style={{ marginTop: "8px" }}>{erro}</div>}

      <div className="recent-card" style={{ marginTop: "1rem" }}>
        <div className="recent-head">Resultado da rastreabilidade</div>

        {resultados === null ? (
          <div className="side-empty">
            Digite um termo e clique em Buscar.
          </div>
        ) : resultados.length === 0 ? (
          <div className="side-empty">
            Nenhum produto encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span>
              <span>Tipo</span>
              <span>Un</span>
              <span>Lote PA</span>
              <span>Lote MP</span>
              <span>Qtd planejada</span>
              <span>MP vinculada</span>
            </div>

            {resultados.map((p) => (
              <div key={p.id} className="t-prod-row">
                <span>{p.nome}</span>
                <span>{p.tipo === "mp" ? "Matéria-prima" : "Produto acabado"}</span>
                <span>{p.un}</span>
                <span>{p.lotePa || "-"}</span>
                <span>{p.mpLote || "-"}</span>
                <span>{p.qtdPa ?? "-"}</span>
                <span>
                  {p.tipo === "pa" && p.mpNome
                    ? `${p.mpNome} (${p.mpUn})`
                    : "-"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= TELA: USUÁRIOS DO SISTEMA ======= */
function UsuariosSistema({ onClose }) {
  const STORAGE_KEY = "translot_usuarios";

  const [usuarios, setUsuarios] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [admin, setAdmin] = React.useState(false);

  function salvarUsuario() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
      admin: admin ? true : false,
    };

    const lista = [...usuarios, novo];
    setUsuarios(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

    setNome("");
    setEmail("");
    setSenha("");
    setAdmin(false);
  }

  return (
    <div className="modal-form">
      <h3 className="config-title">Gerenciar usuários</h3>
      <p className="config-subtitle">Cadastre usuários e defina permissões.</p>

      <div className="form-grid">
        <div className="field">
          <label className="label">Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="field">
          <label className="label">E-mail</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field">
          <label className="label">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Administrador?</label>
          <select
            value={admin ? "true" : "false"}
            onChange={(e) => setAdmin(e.target.value === "true")}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="actions full">
          <button
            className="primary-btn"
            type="button"
            onClick={salvarUsuario}
          >
            Salvar usuário
          </button>
        </div>
      </div>

      <div className="recent-card" style={{ marginTop: "1rem" }}>
        <div className="recent-head">Usuários cadastrados</div>

        {usuarios.length === 0 ? (
          <div className="side-empty">Nenhum usuário cadastrado.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Nome</span>
              <span>Email</span>
              <span>Admin</span>
            </div>

            {usuarios.map((u) => (
              <div key={u.id} className="t-row">
                <span>{u.nome}</span>
                <span>{u.email}</span>
                <span>{u.admin ? "Sim" : "Não"}</span>
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

