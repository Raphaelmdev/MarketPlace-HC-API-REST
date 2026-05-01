export function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

export function formatPrice(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatCPF(value) {
  return onlyNumbers(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value) {
  return onlyNumbers(value)
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCEP(value) {
  return onlyNumbers(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatOrderStatus(status) {
  const map = {
    pending:    "Aguardando Pagamento",
    confirmed:  "Confirmado",
    processing: "Em Confecção",
    shipped:    "Enviado",
    delivered:  "Entregue",
    cancelled:  "Cancelado",
  };
  return map[status] ?? status;
}

export function truncate(text, max = 60) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export function formatCurrencyInput(value) {
  let numbers = onlyNumbers(value);
  numbers = numbers.slice(0, 10);
  if (!numbers) return "";
  return formatPrice(Number(numbers) / 100);
}

export function parseCurrencyToNumber(value) {
  const numbers = onlyNumbers(value);
  if (!numbers) return "";
  return Number(numbers) / 100;
}