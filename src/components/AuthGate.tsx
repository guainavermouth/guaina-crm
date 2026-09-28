import { useState, type FormEvent } from 'react'
import { login } from '../lib/auth'

interface AuthGateProps {
  onAuthenticated: () => void
}

export default function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      onAuthenticated()
      return
    }
    setError(true)
    setShake(true)
    window.setTimeout(() => setShake(false), 400)
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-canvas">
      <div
        className={`w-full max-w-sm card-base p-8 ${shake ? 'animate-[shake_0.35s_ease]' : ''}`}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/logo.png"
            alt="Guaina"
            className="h-10 w-auto object-contain mb-4"
          />
          <h1 className="text-xl font-bold text-ink tracking-tight">CRM Guaina</h1>
          <p className="text-sm text-muted mt-1">Ingresá la contraseña para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="crm-password" className="table-header block mb-1.5 text-left">
              Contraseña
            </label>
            <input
              id="crm-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(false)
              }}
              className={`w-full bg-canvas text-sm text-ink rounded-xl px-3 py-2.5 outline-none border transition-colors focus:ring-2 focus:ring-terracota/20 ${
                error ? 'border-red-400' : 'border-transparent'
              }`}
              placeholder="••••••••"
            />
            {error && (
              <p className="text-xs text-red-600 font-medium mt-1.5 text-left">
                Contraseña incorrecta
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full justify-center">
            Entrar
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
