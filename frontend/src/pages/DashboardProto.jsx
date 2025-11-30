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

            <button
              className="icon-btn icon-btn-help"
              title="Ajuda"
              onClick={() => openModal("ajuda", "Ajuda")}
            >
              ❓
            </button>
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

/* ======= TELA: ENTRADA DE PRODUTO ======= */
function EntradaProdutoForm({ onClose }) {
  const STORAGE = "translot_mov_entradas";
  const [item, setItem] = React.useState("");
  const [qtd, setQtd] = React.useState("");
  const [un, setUn] = React.useState("kg");
  const [lote, setLote] = React.useState("");
  const [fab, setFab] = React.useState("");
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");
  const [recentes, setRecentes] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) ?? [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "F9") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    setErr("");
    setOk("");
    if (!item.trim()) return setErr("Informe o item.");
    const n = Number(qtd);
    if (!qtd || isNaN(n) || n <= 0) return setErr("Quantidade inválida.");
    if (!un) return setErr("Selecione a unidade.");
    if (!lote.trim()) return setErr("Informe o lote.");
    if (!fab.trim()) return setErr("Informe o fabricante.");

    const reg = {
      id: Date.now(),
      item: item.trim(),
      quantidade: n,
      unidade: un,
      lote: lote.trim(),
      fabricante: fab.trim(),
      data: new Date().toISOString(),
    };

    const next = [reg, ...recentes].slice(0, 10);
    setRecentes(next);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next));
    } catch {}
    setOk("Entrada registrada.");

    setItem("");
    setQtd("");
    setUn("kg");
    setLote("");
    setFab("");
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
          <label className="label">Item</label>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Ex.: Ferro SAE 1020"
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
          />
        </div>
        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={(e) => setUn(e.target.value)}>
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
          />
        </div>
        <div className="field">
          <label className="label">Fabricante</label>
          <input
            value={fab}
            onChange={(e) => setFab(e.target.value)}
            placeholder="Ex.: Aço Brasil S.A."
          />
        </div>

        {err && <div className="alert error full">{err}</div>}
        {ok && (
          <div className="alert ok full">
            ✅ {ok}
          </div>
        )}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancelar (Esc)
          </button>
          <button type="submit" className="btn small">
            Salvar (F9)
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Últimas entradas</div>
        {recentes.length === 0 ? (
          <div className="side-empty">Nenhum registro ainda.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Data</span>
              <span>Item</span>
              <span>Qtd</span>
              <span>Lote</span>
              <span>Fabricante</span>
            </div>
            {recentes.map((r) => (
              <div key={r.id} className="t-row">
                <span>{new Date(r.data).toLocaleString()}</span>
                <span>{r.item}</span>
                <span>{`${r.quantidade} ${r.unidade}`}</span>
                <span>{r.lote}</span>
                <span>{r.fabricante}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= TELA: CADASTRO DE PRODUTOS ======= */
function CadastroProdutos({ onClose }) {
  const STORAGE = "translot_produtos";
  const ENTRADAS = "translot_mov_entradas";

  const [nome, setNome] = React.useState("");
  const [un, setUn] = React.useState("un");
  const [tipo, setTipo] = React.useState("mp"); // mp / pa

  const [mpKey, setMpKey] = React.useState("");
  const [mpLote, setMpLote] = React.useState("");
  const [lotePa, setLotePa] = React.useState("");
  const [qtdPa, setQtdPa] = React.useState("");

  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");

  const [produtos, setProdutos] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) ?? [];
    } catch {
      return [];
    }
  });

  const entradas = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(ENTRADAS)) ?? [];
    } catch {
      return [];
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(produtos));
    } catch {}
  }, [produtos]);

  const materiais = React.useMemo(() => {
    const map = new Map();
    for (const e of entradas) {
      const name = (e.item || "").trim();
      const key = `${name.toLowerCase()}||${e.unidade}`;
      const tot = Number(e.quantidade || 0);
      if (!name || !e.unidade || !isFinite(tot)) continue;
      const prev = map.get(key) || { nome: name, un: e.unidade, total: 0 };
      prev.total += tot;
      map.set(key, prev);
    }
    return Array.from(map.values()).filter((m) => m.total > 0);
  }, [entradas]);

  const lotesMp = React.useMemo(() => {
    if (!mpKey) return [];
    const [nomeLower, unSel] = mpKey.split("||");
    const acc = new Map();
    for (const e of entradas) {
      const itemLower = (e.item || "").trim().toLowerCase();
      if (itemLower === nomeLower && e.unidade === unSel) {
        const qtd = Number(e.quantidade || 0);
        const k = (e.lote || "").trim();
        if (!k) continue;
        const prev = acc.get(k) || 0;
        acc.set(k, prev + (isFinite(qtd) ? qtd : 0));
      }
    }
    return Array.from(acc.entries())
      .filter(([, tot]) => tot > 0)
      .map(([lote, total]) => ({ lote, total, un: unSel }));
  }, [mpKey, entradas]);

  React.useEffect(() => {
    if (mpLote && !lotesMp.find((l) => l.lote === mpLote)) setMpLote("");
  }, [mpKey, lotesMp, mpLote]);

  function totalEntrada(nomeRef, unRef) {
    const n = nomeRef.trim().toLowerCase();
    return entradas
      .filter(
        (e) =>
          e.unidade === unRef &&
          (e.item || "").trim().toLowerCase() === n
      )
      .reduce((s, e) => s + Number(e.quantidade || 0), 0);
  }

  function salvar() {
    setErr("");
    setOk("");

    if (!nome.trim()) return setErr("Informe o nome do produto.");
    if (!un) return setErr("Selecione a unidade.");

    let mpNome = "",
      mpUn = "",
      mpL = "",
      lotePA = "",
      qtdPA = 0,
      mpId = null;

    if (tipo === "pa") {
      if (!mpKey) return setErr("Selecione a matéria-prima.");
      if (!mpLote) return setErr("Selecione o lote da matéria-prima.");
      if (!lotePa.trim())
        return setErr("Defina o novo lote do produto acabado.");
      const nQtd = Number(qtdPa);
      if (!qtdPa || isNaN(nQtd) || nQtd <= 0) {
        return setErr(
          "Informe a quantidade a produzir (maior que zero)."
        );
      }

      const [nomeLower, unSel] = mpKey.split("||");
      mpUn = unSel;
      mpNome =
        materiais.find(
          (m) =>
            m.un === unSel && m.nome.toLowerCase() === nomeLower
        )?.nome || "";
      mpL = mpLote.trim();
      lotePA = lotePa.trim();
      qtdPA = nQtd;

      const mpProd = produtos.find(
        (p) =>
          p.tipo === "mp" &&
          p.un === mpUn &&
          (p.nome || "").trim().toLowerCase() ===
            (mpNome || "").trim().toLowerCase()
      );
      if (mpProd) {
        mpId = mpProd.id;
      }
    }

    const nomeLower = nome.trim().toLowerCase();
    const exists = produtos.some((p) => {
      if (p.tipo === "mp" && tipo === "mp") {
        return p.un === un && p.nome.trim().toLowerCase() === nomeLower;
      }
      if (p.tipo === "pa" && tipo === "pa") {
        return (
          p.un === un &&
          p.nome.trim().toLowerCase() === nomeLower &&
          (p.lotePa || "").trim().toLowerCase() === lotePA.toLowerCase()
        );
      }
      return false;
    });

    if (exists)
      return setErr(
        tipo === "pa"
          ? "Já existe este produto acabado com o mesmo lote."
          : "Já existe uma matéria-prima com esse nome e unidade."
      );

    const novo = {
      id: Date.now(),
      nome: nome.trim(),
      un,
      tipo,
      mpNome,
      mpUn,
      mpLote: mpL,
      lotePa: lotePA,
      qtdPa: qtdPA,
      mpId,
    };

    setProdutos([novo, ...produtos]);
    setOk("Produto cadastrado.");
    setNome("");
    setUn("un");
    setTipo("mp");
    setMpKey("");
    setMpLote("");
    setLotePa("");
    setQtdPa("");
  }

  function remover(id) {
    setProdutos(produtos.filter((p) => p.id !== id));
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
          <label className="label">Nome do produto</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Parafuso 1/4 zincado"
          />
        </div>

        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={(e) => setUn(e.target.value)}>
            <option value="t">Toneladas (t)</option>
            <option value="kg">Quilos (kg)</option>
            <option value="g">Gramas (g)</option>
            <option value="mg">Miligramas (mg)</option>
            <option value="un">Unidade (un)</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="mp">Matéria-prima</option>
            <option value="pa">Produto acabado</option>
          </select>
        </div>

        {tipo === "pa" && (
          <>
            <div className="field">
              <label className="label">Matéria-prima (em estoque)</label>
              <select
                value={mpKey}
                onChange={(e) => setMpKey(e.target.value)}
                disabled={materiais.length === 0}
              >
                <option value="">
                  {materiais.length ? "Selecione..." : "Sem estoque de MP"}
                </option>
                {materiais.map((m) => {
                  const key = `${m.nome.toLowerCase()}||${m.un}`;
                  return (
                    <option key={key} value={key}>
                      {`${m.nome} (${m.un}) — ${m.total} ${m.un}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="field">
              <label className="label">Lote da MP</label>
              <select
                value={mpLote}
                onChange={(e) => setMpLote(e.target.value)}
                disabled={!mpKey || lotesMp.length === 0}
              >
                <option value="">
                  {!mpKey || lotesMp.length === 0
                    ? "Selecione a MP"
                    : "Selecione..."}
                </option>
                {lotesMp.map((l) => (
                  <option key={l.lote} value={l.lote}>
                    {`${l.lote} — ${l.total} ${l.un}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Lote do produto (novo)</label>
              <input
                value={lotePa}
                onChange={(e) => setLotePa(e.target.value)}
                placeholder="Ex.: L-PA-0001"
              />
            </div>

            <div className="field">
              <label className="label">Qtd a produzir</label>
              <input
                type="number"
                step="any"
                value={qtdPa}
                onChange={(e) => setQtdPa(e.target.value)}
                placeholder="Ex.: 100"
              />
            </div>
          </>
        )}

        {err && <div className="alert error full">{err}</div>}
        {ok && (
          <div className="alert ok full">
            ✅ {ok}
          </div>
        )}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Fechar
          </button>
          <button type="submit" className="btn small">
            Salvar
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Produtos cadastrados</div>
        {produtos.length === 0 ? (
          <div className="side-empty">Nenhum produto cadastrado.</div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span>
              <span>Un</span>
              <span>Tipo</span>
              <span>MP vinculada</span>
              <span>Lote MP</span>
              <span>Lote PA</span>
              <span>Qtd PA</span>
              <span>Entradas</span>
              <span>Ações</span>
            </div>
            {produtos.map((p) => (
              <div key={p.id} className="t-prod-row">
                <span>{p.nome}</span>
                <span>{p.un}</span>
                <span>
                  {p.tipo === "mp" ? "Matéria-prima" : "Produto acabado"}
                </span>
                <span>
                  {p.tipo === "pa" ? `${p.mpNome} (${p.mpUn})` : "-"}
                </span>
                <span>{p.tipo === "pa" ? p.mpLote || "-" : "-"}</span>
                <span>{p.tipo === "pa" ? p.lotePa || "-" : "-"}</span>
                <span>{p.tipo === "pa" ? p.qtdPa ?? "-" : "-"}</span>
                <span>{totalEntrada(p.nome, p.un)} {p.un}</span>
                <span>
                  <button
                    className="ghost-btn"
                    onClick={() => remover(p.id)}
                  >
                    Excluir
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

/* ======= TELA: EXECUÇÃO DE PRODUÇÃO ======= */
function ExecProducao({ onClose }) {
  const STORAGE_PROD = "translot_produtos";
  const STORAGE_MOV = "translot_mov_entradas";
  const STORAGE_PRODUCOES = "translot_mov_producao";

  const [produtos, setProdutos] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PROD)) ?? [];
    } catch {
      return [];
    }
  });

  const [movs, setMovs] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_MOV)) ?? [];
    } catch {
      return [];
    }
  });

  const [producoes, setProducoes] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PRODUCOES)) ?? [];
    } catch {
      return [];
    }
  });

  const produtosPA = React.useMemo(
    () => produtos.filter((p) => p.tipo === "pa"),
    [produtos]
  );
  const produtosMP = React.useMemo(
    () => produtos.filter((p) => p.tipo === "mp"),
    [produtos]
  );

  const [produtoPaId, setProdutoPaId] = React.useState("");
  const [qtdPa, setQtdPa] = React.useState("");
  const [mpId, setMpId] = React.useState("");
  const [mpLote, setMpLote] = React.useState("");
  const [qtdMp, setQtdMp] = React.useState("");
  const [lotePa, setLotePa] = React.useState(() => gerarLotePa());
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");

  React.useEffect(() => {
    if (!produtoPaId) return;

    const pa = produtosPA.find((p) => String(p.id) === String(produtoPaId));
    if (!pa) return;

    if (pa.mpId) {
      setMpId(String(pa.mpId));
    } else if (pa.mpNome && pa.mpUn) {
      const mp = produtosMP.find(
        (m) =>
          m.tipo === "mp" &&
          (m.nome || "").trim().toLowerCase() ===
            pa.mpNome.trim().toLowerCase() &&
          m.un === pa.mpUn
      );
      if (mp) setMpId(String(mp.id));
    }

    if (pa.qtdPa && !qtdPa) {
      setQtdPa(String(pa.qtdPa));
    }

    if (pa.mpLote && !mpLote) {
      setMpLote(pa.mpLote);
    }
  }, [produtoPaId, produtosPA, produtosMP, qtdPa, mpLote]);

  function gerarLotePa() {
    const now = new Date();
    const data = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");
    const rand = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
    return `L-PA-${data}-${rand}`;
  }

  const lotesMp = React.useMemo(() => {
    if (!mpId) return [];
    const mp = produtosMP.find((p) => String(p.id) === String(mpId));
    if (!mp) return [];

    const nomeLower = (mp.nome || "").trim().toLowerCase();
    const un = mp.un;

    const mapa = new Map();
    for (const m of movs) {
      const itemLower = (m.item || "").trim().toLowerCase();
      if (itemLower === nomeLower && m.unidade === un) {
        const lote = (m.lote || "").trim();
        if (!lote) continue;
        const qtd = Number(m.quantidade || 0);
        const atual = mapa.get(lote) || 0;
        mapa.set(lote, atual + (isFinite(qtd) ? qtd : 0));
      }
    }

    return Array.from(mapa.entries())
      .filter(([, tot]) => tot > 0)
      .map(([lote, total]) => ({ lote, total, un }));
  }, [mpId, movs, produtosMP]);

  React.useEffect(() => {
    if (mpLote && !lotesMp.find((l) => l.lote === mpLote)) {
      setMpLote("");
    }
  }, [mpLote, lotesMp]);

  function handleProduzir(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!produtoPaId) return setErr("Selecione o produto acabado.");
    if (!qtdPa || Number(qtdPa) <= 0)
      return setErr("Informe a quantidade a produzir.");
    if (!mpId) return setErr("Selecione a matéria-prima.");
    if (!mpLote) return setErr("Selecione o lote da matéria-prima.");
    if (!qtdMp || Number(qtdMp) <= 0)
      return setErr("Informe a quantidade de MP a consumir.");
    if (!lotePa.trim())
      return setErr("Defina/ajuste o lote do produto acabado.");

    const pa = produtosPA.find((p) => String(p.id) === String(produtoPaId));
    const mp = produtosMP.find((p) => String(p.id) === String(mpId));
    if (!pa || !mp)
      return setErr("Produto acabado ou matéria-prima inválidos.");

    const qtdMpNum = Number(qtdMp);
    const qtdPaNum = Number(qtdPa);

    const estoqueLote = lotesMp.find((l) => l.lote === mpLote)?.total ?? 0;
    if (qtdMpNum > estoqueLote) {
      return setErr(
        `Estoque insuficiente no lote ${mpLote}. Disponível: ${estoqueLote} ${mp.un}.`
      );
    }

    const now = new Date().toISOString();

    const movConsumoMp = {
      id: Date.now(),
      item: mp.nome,
      quantidade: -qtdMpNum,
      unidade: mp.un,
      lote: mpLote,
      fabricante: "",
      data: now,
      tipoMov: "consumo_producao",
    };

    const movEntradaPa = {
      id: Date.now() + 1,
      item: pa.nome,
      quantidade: qtdPaNum,
      unidade: pa.un,
      lote: lotePa.trim(),
      fabricante: "",
      data: now,
      tipoMov: "producao",
    };

    const novosMovs = [movEntradaPa, movConsumoMp, ...movs];
    setMovs(novosMovs);
    try {
      localStorage.setItem(STORAGE_MOV, JSON.stringify(novosMovs));
    } catch {}

    const producao = {
      id: Date.now(),
      data: now,
      produtoId: pa.id,
      produtoNome: pa.nome,
      paUn: pa.un,
      lotePa: lotePa.trim(),
      qtdPa: qtdPaNum,
      mpId: mp.id,
      mpNome: mp.nome,
      mpUn: mp.un,
      mpLote,
      qtdMp: qtdMpNum,
    };

    const novasProducoes = [producao, ...producoes];
    setProducoes(novasProducoes);
    try {
      localStorage.setItem(
        STORAGE_PRODUCOES,
        JSON.stringify(novasProducoes)
      );
    } catch {}

    setOk("Produção registrada com sucesso.");
    setQtdPa("");
    setQtdMp("");
    setLotePa(gerarLotePa());
  }

  return (
    <div className="modal-form">
      <form onSubmit={handleProduzir} className="form-grid form-producao">
        <div className="field full">
          <label className="label">Produto acabado</label>
          <select
            value={produtoPaId}
            onChange={(e) => setProdutoPaId(e.target.value)}
          >
            <option value="">
              {produtosPA.length
                ? "Selecione..."
                : "Nenhum produto acabado cadastrado"}
            </option>
            {produtosPA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.un})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Qtd a produzir</label>
          <input
            type="number"
            step="any"
            value={qtdPa}
            onChange={(e) => setQtdPa(e.target.value)}
            placeholder="Ex.: 10"
          />
        </div>

        <div className="field">
          <label className="label">Lote do produto (auto)</label>
          <input
            value={lotePa}
            onChange={(e) => setLotePa(e.target.value)}
          />
        </div>

        <div className="field full">
          <hr className="field-separator" />
        </div>

        <div className="field">
          <label className="label">Matéria-prima</label>
          <select
            value={mpId}
            onChange={(e) => setMpId(e.target.value)}
          >
            <option value="">
              {produtosMP.length
                ? "Selecione..."
                : "Nenhuma matéria-prima cadastrada"}
            </option>
            {produtosMP.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.un})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Lote da MP</label>
          <select
            value={mpLote}
            onChange={(e) => setMpLote(e.target.value)}
            disabled={!mpId || lotesMp.length === 0}
          >
            <option value="">
              {!mpId || lotesMp.length === 0
                ? "Selecione a MP"
                : "Selecione o lote"}
            </option>
            {lotesMp.map((l) => (
              <option key={l.lote} value={l.lote}>
                {l.lote} — {l.total} {l.un}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Qtd MP a consumir</label>
          <input
            type="number"
            step="any"
            value={qtdMp}
            onChange={(e) => setQtdMp(e.target.value)}
            placeholder="Ex.: 5"
          />
        </div>

        {err && <div className="alert error full">{err}</div>}
        {ok && (
          <div className="alert ok full">
            ✅ {ok}
          </div>
        )}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Fechar
          </button>
          <button type="submit" className="btn small">
            Registrar produção
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Últimas produções</div>
        {producoes.length === 0 ? (
          <div className="side-empty">Nenhuma produção registrada.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Data</span>
              <span>Produto</span>
              <span>Lote PA</span>
              <span>Qtd PA</span>
              <span>MP / lote</span>
              <span>Qtd MP</span>
            </div>
            {producoes.map((p) => (
              <div key={p.id} className="t-row">
                <span>{new Date(p.data).toLocaleString()}</span>
                <span>{p.produtoNome}</span>
                <span>{p.lotePa}</span>
                <span>{p.qtdPa}</span>
                <span>
                  {p.mpNome} ({p.mpLote})
                </span>
                <span>
                  {p.qtdMp} {p.mpUn}
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

/* ======= TELA: ESTOQUE ======= */
function Estoque({ onClose }) {
  const STORAGE_PROD = "translot_produtos";
  const STORAGE_MOV = "translot_mov_entradas";
  const STORAGE_PRODUCOES = "translot_mov_producao";

  const [produtos] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PROD)) ?? [];
    } catch {
      return [];
    }
  });

  const [movs] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_MOV)) ?? [];
    } catch {
      return [];
    }
  });

  const [producoes] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PRODUCOES)) ?? [];
    } catch {
      return [];
    }
  });

  const indexProdLote = React.useMemo(() => {
    const map = new Map();
    for (const p of producoes) {
      const key = `${String(p.produtoId)}||${(p.lotePa || "").trim().toLowerCase()}`;
      if (!map.has(key)) map.set(key, p);
    }
    return map;
  }, [producoes]);

  const linhasBase = React.useMemo(() => {
    const resultado = [];

    for (const prod of produtos) {
      const nomeLower = (prod.nome || "").trim().toLowerCase();
      const un = prod.un;
      if (!nomeLower || !un) continue;

      const mapaLotes = new Map();

      for (const m of movs) {
        const itemLower = (m.item || "").trim().toLowerCase();
        if (itemLower !== nomeLower) continue;
        if (m.unidade !== un) continue;

        const lote = (m.lote || "").trim() || "-";
        const qtd = Number(m.quantidade || 0);
        if (!isFinite(qtd)) continue;

        const atual = mapaLotes.get(lote) || 0;
        mapaLotes.set(lote, atual + qtd);
      }

      if (mapaLotes.size === 0) {
        resultado.push({
          idProduto: prod.id,
          nome: prod.nome,
          tipo: prod.tipo,
          un: prod.un,
          lote: "-",
          saldo: 0,
          mpNome: "-",
          mpLote: "-",
        });
        continue;
      }

      for (const [lote, saldo] of mapaLotes.entries()) {
        const linha = {
          idProduto: prod.id,
          nome: prod.nome,
          tipo: prod.tipo,
          un: prod.un,
          lote,
          saldo,
          mpNome: "-",
          mpLote: "-",
        };

        if (prod.tipo === "pa") {
          const key = `${String(prod.id)}||${lote.trim().toLowerCase()}`;
          const hist = indexProdLote.get(key);
          if (hist) {
            linha.mpNome = hist.mpNome || "-";
            linha.mpLote = hist.mpLote || "-";
          }
        }

        resultado.push(linha);
      }
    }

    return resultado;
  }, [produtos, movs, indexProdLote]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchField, setSearchField] = React.useState("nome");
  const [filtroTipo, setFiltroTipo] = React.useState("todos");

  const linhasFiltradas = React.useMemo(() => {
    let base = [...linhasBase];

    if (filtroTipo !== "todos") base = base.filter((l) => l.tipo === filtroTipo);

    const term = searchTerm.trim().toLowerCase();
    if (!term) return base;

    if (searchField === "lote") {
      return base.filter((l) =>
        (l.lote || "").toLowerCase().includes(term)
      );
    }

    return base.filter((l) =>
      (l.nome || "").toLowerCase().includes(term)
    );
  }, [linhasBase, filtroTipo, searchField, searchTerm]);

  return (
    <div className="modal-form">
      <div className="form-grid form-estoque-filtros">
        <div className="field full">
          <label className="label">Pesquisar</label>
          <input
            placeholder={
              searchField === "nome"
                ? "Digite o nome do item..."
                : "Digite o lote..."
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
            <option value="nome">Nome</option>
            <option value="lote">Lote</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Mostrar</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="mp">Somente matéria-prima</option>
            <option value="pa">Somente produto acabado</option>
          </select>
        </div>
      </div>

      <div className="recent-card">
        <div className="recent-head">Estoque por lote</div>

        {linhasFiltradas.length === 0 ? (
          <div className="side-empty">
            Nenhum item encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span>
              <span>Tipo</span>
              <span>Un</span>
              <span>Lote</span>
              <span>Saldo</span>
              <span>Matéria-prima usada</span>
              <span>Lote da MP</span>
            </div>

            {linhasFiltradas.map((l, idx) => (
              <div
                key={`${l.idProduto}-${l.lote}-${idx}`}
                className="t-prod-row"
              >
                <span>{l.nome}</span>
                <span>
                  {l.tipo === "mp" ? "Matéria-prima" : "Produto acabado"}
                </span>
                <span>{l.un}</span>
                <span>{l.lote}</span>
                <span>
                  {l.saldo} {l.un}
                </span>
                <span>{l.tipo === "pa" ? l.mpNome : "-"}</span>
                <span>{l.tipo === "pa" ? l.mpLote : "-"}</span>
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

