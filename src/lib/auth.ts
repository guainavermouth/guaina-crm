const AUTH_KEY = 'guaina-crm-auth'
const AUTH_TOKEN = 'ok'

/** Contraseña del CRM. Override con VITE_CRM_PASSWORD en .env / Vercel. */
export const CRM_PASSWORD =
  (import.meta.env.VITE_CRM_PASSWORD as string | undefined)?.trim() || 'malbecagrelo'

export function isAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === AUTH_TOKEN
  } catch {
    return false
  }
}

export function login(password: string): boolean {
  if (password.trim() !== CRM_PASSWORD) return false
  try {
    sessionStorage.setItem(AUTH_KEY, AUTH_TOKEN)
  } catch {
    // still allow session for this page load
  }
  return true
}

export function logout(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY)
  } catch {
    // ignore
  }
}
