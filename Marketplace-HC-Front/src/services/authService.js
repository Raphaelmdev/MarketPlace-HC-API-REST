const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// TESTE: 30 segundos
//const SESSION_DURATION = 1000 * 30;

// PADRÃO: 30 minutos
const SESSION_DURATION = 1000 * 60 * 60 * 2;

async function getErrorMessage(response, defaultMessage) {
  try {
    const errorData = await response.json();
    return errorData.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

function saveSession(result) {
  const expiresAt = Date.now() + SESSION_DURATION;

  localStorage.setItem("token", result.token);
  localStorage.setItem("expiresAt", String(expiresAt));

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role
    })
  );

  window.dispatchEvent(new Event("authChanged"));
}

export async function checkEmail(email) {
  const response = await fetch(
    `${API_URL}/check-email?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    const message = await getErrorMessage(response, "Erro ao verificar email.");
    throw new Error(message);
  }

  return await response.json();
}

export async function register(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const message = await getErrorMessage(response, "Erro ao cadastrar.");
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return await response.json();
}

export async function login(data) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const message = await getErrorMessage(response, "Email ou senha inválidos.");
    throw new Error(message);
  }

  const result = await response.json();

  saveSession(result);

  return result;
}

export async function forgotPassword(data) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Erro ao solicitar recuperação de senha."
    );
    throw new Error(message);
  }

  return await response.json();
}

export async function resetPassword(data) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const message = await getErrorMessage(response, "Erro ao redefinir senha.");
    throw new Error(message);
  }

  return await response.json();
}