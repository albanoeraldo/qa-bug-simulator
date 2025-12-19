import { addLog } from "./bug_logger.js";

// Estado simples do simulador
export function createState() {
  return {
    profile: "user",      // user | admin
    status: "Aberto",
    events: 0,
    attempt: 0,           // usado no bug intermitente
    loading: false,
  };
}

// Executa a simulação do bug selecionado
export function runBug({ bug, state, ui }) {
  const { logBox, statusEl, eventsEl, actualEl } = ui;

  state.attempt += 1;
  addLog(logBox, `Executando ação para ${bug.id} (${bug.name})...`);

  switch (bug.id) {
    case "BUG-001": {
      // Simula duplicação: cada clique dispara "envio"
      state.events += 1;
      eventsEl.textContent = String(state.events);
      actualEl.textContent = `Evento enviado ${state.events}x (duplicado).`;
      addLog(logBox, `⚠️ Evento disparado. Total de envios: ${state.events}`);
      break;
    }

    case "BUG-002": {
      // Backend "ok", UI não muda status
      addLog(logBox, "✅ Backend respondeu OK (200).");
      // NÃO atualiza status de propósito:
      actualEl.textContent = "Backend OK, mas o status exibido não mudou.";
      addLog(logBox, "⚠️ UI não atualizou o status após sucesso.");
      break;
    }

    case "BUG-003": {
      // Loading infinito
      state.loading = true;
      state.status = "Carregando...";
      statusEl.textContent = state.status;
      actualEl.textContent = "Loading iniciado e não finaliza (spinner infinito).";
      addLog(logBox, "⏳ Loading iniciado… (sem finalização)");
      break;
    }

    case "BUG-004": {
      // Erro intermitente: 1ª falha, 2ª ok
      if (state.attempt === 1) {
        actualEl.textContent = "Erro genérico na primeira tentativa.";
        addLog(logBox, "❌ Erro: 'Falha ao processar solicitação'.");
      } else {
        actualEl.textContent = "Na segunda tentativa, funcionou normalmente.";
        addLog(logBox, "✅ Na segunda tentativa, ação concluída.");
        state.status = "Em andamento";
        statusEl.textContent = state.status;
      }
      break;
    }

    case "BUG-005": {
      // Esse bug depende mais da ação secundária. Aqui só loga.
      actualEl.textContent = "Use a Ação secundária para simular permissão incorreta.";
      addLog(logBox, "ℹ️ Dica: alternar perfil e usar Ação secundária.");
      break;
    }

    default:
      actualEl.textContent = "Bug não implementado ainda.";
      addLog(logBox, "⚠️ Bug selecionado ainda não foi implementado.");
  }
}

// Ação secundária (boa para bug de permissão)
export function runSecondaryAction({ bug, state, ui }) {
  const { logBox, actualEl } = ui;

  addLog(logBox, "Executando ação secundária...");

  if (bug.id === "BUG-005") {
    if (state.profile === "user") {
      actualEl.textContent = "Botão/ação indisponível para Usuário (sem feedback claro).";
      addLog(logBox, "❌ Permissão negada: botão não aparece / ação bloqueada.");
    } else {
      actualEl.textContent = "Admin conseguiu acessar e baixar normalmente.";
      addLog(logBox, "✅ Admin: ação disponível e executada.");
    }
    return;
  }

  actualEl.textContent = "Ação secundária executada (sem efeito relevante para este bug).";
  addLog(logBox, "ℹ️ Ação secundária sem efeito para o bug atual.");
}
