export const BUGS = [
  {
    id: "BUG-001",
    name: "Duplo clique duplica envio",
    severity: "Crítica",
    description: "A ação de envio pode ser disparada múltiplas vezes com cliques repetidos, gerando duplicidade (ex: pedido enviado 4x).",
    steps: [
      "Selecionar este bug no dropdown",
      "Clicar rapidamente em “Executar ação” 3 a 4 vezes",
      "Observar o contador de eventos e logs"
    ],
    expected: "A ação deve executar apenas 1 vez; botão deve ser bloqueado durante o envio.",
    actualDefault: "A ação é executada múltiplas vezes, duplicando registros.",
    fixHint: "Desabilitar botão durante request, aplicar debounce/throttle e idempotência no backend."
  },
  {
    id: "BUG-002",
    name: "Backend OK, UI não atualiza status",
    severity: "Alta",
    description: "A operação conclui com sucesso, mas a interface não reflete o novo status.",
    steps: [
      "Selecionar este bug no dropdown",
      "Clicar em “Executar ação”",
      "Ver que o log indica sucesso, mas o status na tela não muda"
    ],
    expected: "Após sucesso, o status deve atualizar na UI (re-render do estado).",
    actualDefault: "O status permanece antigo, causando confusão no usuário.",
    fixHint: "Atualizar estado local e re-render; garantir que a UI observe mudanças (state management)."
  },
  {
    id: "BUG-003",
    name: "Loading infinito (spinner não finaliza)",
    severity: "Média",
    description: "A tela fica presa em carregamento, mesmo após tempo alto, sem feedback adequado.",
    steps: [
      "Selecionar este bug no dropdown",
      "Clicar em “Executar ação”",
      "Ver que o status entra em “Carregando...” e não sai"
    ],
    expected: "Loading deve finalizar com sucesso ou erro + mensagem + botão tentar novamente.",
    actualDefault: "Loading nunca finaliza, travando o fluxo.",
    fixHint: "Implementar timeout, tratamento de erro, e fallback de UI."
  },
  {
    id: "BUG-004",
    name: "Erro intermitente (falha 1x, funciona depois)",
    severity: "Alta",
    description: "Primeira tentativa falha com erro genérico; a segunda tentativa funciona sem explicação.",
    steps: [
      "Selecionar este bug no dropdown",
      "Clicar em “Executar ação” (1ª tentativa falha)",
      "Clicar de novo (2ª tentativa passa)"
    ],
    expected: "Se houver erro, deve haver mensagem clara e consistência; retries controlados.",
    actualDefault: "Falha na primeira e passa na segunda, causando incerteza.",
    fixHint: "Retry controlado com backoff, melhorar mensagens, revisar estabilidade do endpoint."
  },
  {
    id: "BUG-005",
    name: "Permissão incorreta (botão some)",
    severity: "Média",
    description: "Um botão importante (ex: baixar contrato) não aparece para determinados perfis, mesmo quando deveria.",
    steps: [
      "Selecionar este bug no dropdown",
      "Alternar perfil para “Usuário”",
      "Clicar em “Ação secundária” e ver o bloqueio"
    ],
    expected: "Botão deve aparecer conforme regra; se bloqueado, mostrar motivo.",
    actualDefault: "Botão some/nega ação sem feedback suficiente.",
    fixHint: "Revisar regra de permissão e render condicional; exibir feedback ao usuário."
  }
];
