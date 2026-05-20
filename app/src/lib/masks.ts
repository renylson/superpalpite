export function formatCPF(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function validateCPF(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += +d[i] * (10 - i);
  let r = 11 - (sum % 11);
  if ((r >= 10 ? 0 : r) !== +d[9]) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += +d[i] * (11 - i);
  r = 11 - (sum % 11);
  return (r >= 10 ? 0 : r) === +d[10];
}

export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function rawPhone(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

export function formatName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\b[a-záàâãéèêíïóôõöúçñ]/gi, (c) => c.toUpperCase());
}

export function validateEmail(email: string): boolean {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com\.br|net\.br|com|net)$/.test(email);
}

export function validatePhone(phone: string): boolean {
  const d = phone.replace(/\D/g, '');
  return d.length === 10 || d.length === 11;
}
