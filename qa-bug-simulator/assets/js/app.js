import { BUGS } from "./bugs/bugDefinitions.js";
import { qs } from "./utils/dom.js";
import { createState, runBug, runSecondaryAction } from "./bugs/bugEngine.js";
import { renderBugDetails } from "./bugs/bug_render.js";
import { addLog, clearLogs } from "./bugs/bug_logger.js";
import { saveState, loadState, clearState } from "./utils/storage.js";

const els = {
  select: qs("#bugSelect"),
  btnAction: qs("#btnAction"),
  btnSecondary: qs("#btnSecondary"),
  btnReset: qs("#btnReset"),
  btnCopy: qs("#btnCopy"),
  btnClearLogs: qs("#btnClearLogs"),

  profileUser: qs("#btnProfileUser"),
  profileAdmin: qs("#btnProfileAdmin"),

  name: qs("#bugName"),
  severity: qs("#bugSeverity"),
  desc: qs("#bugDesc"),
  steps: qs("#bugSteps"),
  expected: qs("#bugExpected"),
  actual: qs("#bugActual"),
  fix: qs("#bugFix"),

  statusValue: qs("#statusValue"),
  eventsCount: qs("#eventsCount"),
  logBox: qs("#logBox"),
};

let state = createState();
let currentBug = BUGS[0];

// --- helpers ---
function setProfile(profile) {
  state.profile = profile;
  els.profileUser.classList.toggle("active", profile === "user");
  els.profileAdmin.classList.toggle("active", profile === "admin");
  addLog(els.logBox, `Perfil alterado para: ${profile === "user" ? "Usuário" : "Admin"}`);
  persist();
}

function setStatus(status) {
  state.status = status;
  els.statusValue.textContent = status;
  persist();
}

function updateCounters() {
  els.eventsCount.textContent = String(state.events);
  els.statusValue.textContent = state.status;
}

function persist() {
  saveState({ state, selectedBugId: currentBug.id });
}

function resetAll() {
  state = createState();
  currentBug = BUGS[0];
  els.select.value = currentBug.id;

  clearLogs(els.logBox);
  renderCurrentBug();
  updateCounters();
  clearState();

  addLog(els.logBox, "🔄 Cenário resetado.");
}

function renderCurrentBug() {
  renderBugDetails({
    bug: currentBug,
    els: {
      name: els.name,
      severity: els.severity,
      desc: els.desc,
      steps: els.steps,
      expected: els.expected,
      actual: els.actual,
      fix: els.fix,
    }
  });
}

// Copia um relatório pronto para colar no Jira/WhatsApp/Email
function buildReportText() {
  const lines = [];
  lines.push(`Relatório de Bug (simulado)`);
  lines.push(`Bug: ${currentBug.id} — ${currentBug.name}`);
  lines.push(`Severidade: ${currentBug.severity}`);
  lines.push(`Ambiente: Base de teste (simulada)`);
  lines.push(`Perfil: ${state.profile === "user" ? "Usuário" : "Admin"}`);
  lines.push(`Status atual na tela: ${state.status}`);
  lines.push("");
  lines.push("Descrição:");
  lines.push(currentBug.description);
  lines.push("");
  lines.push("Passos para reproduzir:");
  currentBug.steps.forEach((s, i) => lines.push(`${i+1}. ${s}`));
  lines.push("");
  lines.push("Resultado esperado:");
  lines.push(currentBug.expected);
  lines.push("");
  lines.push("Resultado atual:");
  lines.push(els.actual.textContent || currentBug.actualDefault);
  lines.push("");
  lines.push("Correção sugerida:");
  lines.push(currentBug.fixHint);
  lines.push("");
  lines.push("Logs recentes:");
  const logLines = Array.from(els.logBox.querySelectorAll("div")).slice(-12).map(d => d.textContent);
  if (logLines.length === 0) lines.push("(sem logs)");
  else logLines.forEach(l => lines.push(l));
  return lines.join("\n");
}

async function copyReport() {
  const text = buildReportText();
  await navigator.clipboard.writeText(text);
  addLog(els.logBox, "📋 Relatório copiado para a área de transferência.");
}

// --- init ---
function initSelect() {
  BUGS.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = `${b.id} — ${b.name}`;
    els.select.appendChild(opt);
  });
}

function loadPersisted() {
  const data = loadState();
  if (!data) return;
  state = data.state || createState();
  const found = BUGS.find(b => b.id === data.selectedBugId);
  if (found) currentBug = found;
  els.select.value = currentBug.id;
  updateCounters();
  addLog(els.logBox, "↩️ Estado restaurado do localStorage.");
}

function bindEvents() {
  els.select.addEventListener("change", () => {
    const id = els.select.value;
    currentBug = BUGS.find(b => b.id === id) || BUGS[0];
    renderCurrentBug();
    persist();
    addLog(els.logBox, `Bug selecionado: ${currentBug.id}`);
  });

  els.btnAction.addEventListener("click", () => {
    runBug({
      bug: currentBug,
      state,
      ui: {
        logBox: els.logBox,
        statusEl: els.statusValue,
        eventsEl: els.eventsCount,
        actualEl: els.actual,
      }
    });
    updateCounters();
    persist();
  });

  els.btnSecondary.addEventListener("click", () => {
    runSecondaryAction({
      bug: currentBug,
      state,
      ui: { logBox: els.logBox, actualEl: els.actual }
    });
    persist();
  });

  els.profileUser.addEventListener("click", () => setProfile("user"));
  els.profileAdmin.addEventListener("click", () => setProfile("admin"));

  els.btnReset.addEventListener("click", resetAll);

  els.btnClearLogs.addEventListener("click", () => {
    clearLogs(els.logBox);
    addLog(els.logBox, "🧹 Logs limpos.");
    persist();
  });

  els.btnCopy.addEventListener("click", () => {
    copyReport().catch(() => addLog(els.logBox, "⚠️ Não foi possível copiar (permissão do navegador)."));
  });
}

// Start
initSelect();
loadPersisted();
renderCurrentBug();
updateCounters();
bindEvents();
addLog(els.logBox, "✅ Simulador iniciado. Selecione um bug e execute ações.");
