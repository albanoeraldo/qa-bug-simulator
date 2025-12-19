export function renderBugDetails({ bug, els }) {
  els.name.textContent = `${bug.id} — ${bug.name}`;
  els.severity.textContent = bug.severity;

  // cor rápida por severidade
  els.severity.classList.remove("sev-low","sev-med","sev-high","sev-crit");
  const sev = bug.severity.toLowerCase();
  if (sev.includes("crít")) els.severity.classList.add("sev-crit");
  else if (sev.includes("alta")) els.severity.classList.add("sev-high");
  else if (sev.includes("média")) els.severity.classList.add("sev-med");
  else els.severity.classList.add("sev-low");

  els.desc.textContent = bug.description;
  els.expected.textContent = bug.expected;
  els.actual.textContent = bug.actualDefault;
  els.fix.textContent = bug.fixHint;

  els.steps.innerHTML = "";
  bug.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    els.steps.appendChild(li);
  });
}
