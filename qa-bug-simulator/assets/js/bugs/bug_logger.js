export function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString("pt-BR", { hour12: false });
}

export function addLog(logBoxEl, message) {
  const line = `[${nowTime()}] ${message}`;
  const div = document.createElement("div");
  div.textContent = line;
  logBoxEl.appendChild(div);
  logBoxEl.scrollTop = logBoxEl.scrollHeight;
  return line;
}

export function clearLogs(logBoxEl) {
  logBoxEl.innerHTML = "";
}
