import { onlyNumbers } from "@/utils/format";

export function validateRequired(value, fieldName) {
  if (!String(value || "").trim()) return `${fieldName} é obrigatório.`;
  return "";
}

export function validateMaxLength(value, max, fieldName) {
  if (String(value || "").trim().length > max)
    return `${fieldName} deve ter no máximo ${max} caracteres.`;
  return "";
}

export function validateMinLength(value, min, fieldName) {
  if (String(value || "").trim().length < min)
    return `${fieldName} deve ter no mínimo ${min} caracteres.`;
  return "";
}

export function validateEmail(email) {
  const value = String(email || "").trim();
  if (!value) return "Email é obrigatório.";
  if (value.length > 150) return "Email deve ter no máximo 150 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido.";
  return "";
}

export function validatePassword(password) {
  const value = String(password || "");
  if (!value.trim()) return "Senha é obrigatória.";
  if (value.length < 6) return "Senha deve ter no mínimo 6 caracteres.";
  if (value.length > 255) return "Senha deve ter no máximo 255 caracteres.";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!String(confirmPassword || "").trim()) return "Confirme a senha.";
  if (password !== confirmPassword) return "As senhas não coincidem.";
  return "";
}

export function validateName(name) {
  const value = String(name || "").trim();
  if (!value) return "Nome é obrigatório.";
  if (value.length < 3) return "Nome deve ter no mínimo 3 caracteres.";
  if (value.length > 100) return "Nome deve ter no máximo 100 caracteres.";
  return "";
}

export function validatePhone(phone) {
  const value = onlyNumbers(phone);
  if (!value) return "";
  if (value.length < 10 || value.length > 11)
    return "Telefone deve conter 10 ou 11 números.";
  return "";
}

export function validateCPF(cpf) {
  const value = onlyNumbers(cpf);
  if (!value) return "CPF é obrigatório.";
  if (value.length !== 11) return "CPF deve conter 11 números.";

  // Rejeita sequências inválidas (ex: 111.111.111-11)
  //if (/^(\d)\1{10}$/.test(value)) return "CPF inválido.";

  // Valida dígitos verificadores
  const calc = (factor) => {
    let sum = 0;
    for (let i = 0; i < factor - 1; i++) {
      sum += parseInt(value[i]) * (factor - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 || rest === 11 ? 0 : rest;
  };

  if (calc(10) !== parseInt(value[9]) || calc(11) !== parseInt(value[10]))
    return "CPF inválido.";

  return "";
}

export function validateCEP(cep) {
  const value = onlyNumbers(cep);
  if (!value) return "CEP é obrigatório.";
  if (value.length !== 8) return "CEP deve conter 8 números.";
  return "";
}

export function validateAddressNumber(number) {
  const value = String(number || "").trim();
  if (!value) return "Número é obrigatório.";
  if (value.length > 10) return "Número deve ter no máximo 10 caracteres.";
  return "";
}

export function validateState(state) {
  const value = String(state || "").trim().toUpperCase();
  const states = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
  ];
  if (!value) return "Estado é obrigatório.";
  if (!states.includes(value)) return "Estado inválido.";
  return "";
}

export function validateRegisterForm(form) {
  const errors = {};

  const nameError = validateName(form.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(form.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    form.password,
    form.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const phoneError = validatePhone(form.phone);
  if (phoneError) errors.phone = phoneError;

  const cpfError = validateCPF(form.cpf);
  if (cpfError) errors.cpf = cpfError;

  const cepError = validateCEP(form.cep);
  if (cepError) errors.cep = cepError;

  const numberError = validateAddressNumber(form.number);
  if (numberError) errors.number = numberError;

  return errors;
}

export function validateLoginForm(form) {
  const errors = {};

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(form.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateProductForm(form) {
  const errors = {};

  const name = String(form.name || "").trim();
  const description = String(form.description || "").trim();
  const price = Number(form.price);
  const stock = Number(form.stock);
  const imageUrl = String(form.imageUrl || "").trim();

  if (!name) errors.name = "Nome do produto é obrigatório.";
  else if (name.length < 2) errors.name = "Nome deve ter no mínimo 2 caracteres.";
  else if (name.length > 100) errors.name = "Nome deve ter no máximo 100 caracteres.";

  if (description.length > 1000)
    errors.description = "Descrição deve ter no máximo 1000 caracteres.";

  if (!form.price) errors.price = "Preço é obrigatório.";
  else if (isNaN(price) || price <= 0) errors.price = "Preço deve ser maior que zero.";
  else if (price > 999999.99) errors.price = "Preço excede o valor máximo permitido.";

  if (form.stock === "" || form.stock === null || form.stock === undefined)
    errors.stock = "Estoque é obrigatório.";
  else if (!Number.isInteger(stock) || stock < 0)
    errors.stock = "Estoque deve ser um número inteiro maior ou igual a zero.";

  if (imageUrl && imageUrl.length > 500)
    errors.imageUrl = "URL da imagem deve ter no máximo 500 caracteres.";

  if (!form.categoryId) errors.categoryId = "Categoria é obrigatória.";

  return errors;
}

export function validateCategoryForm(form) {
  const errors = {};

  const name = String(form.name || "").trim();
  const description = String(form.description || "").trim();

  if (!name) errors.name = "Nome da categoria é obrigatório.";
  else if (name.length < 2) errors.name = "Nome deve ter no mínimo 2 caracteres.";
  else if (name.length > 100) errors.name = "Nome deve ter no máximo 100 caracteres.";

  if (description.length > 255)
    errors.description = "Descrição deve ter no máximo 255 caracteres.";

  return errors;
}