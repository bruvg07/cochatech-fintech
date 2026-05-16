import type { FormEvent } from 'react'

import './auth.css'

type AuthScreenProps = {
  onSubmit: () => void
}

function CardIdIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V6.75Zm2.25-.75a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-.75-.75H6.75Z" />
      <path d="M8.25 8.25h7.5v1.5h-7.5zM8.25 11.25h7.5v1.5h-7.5zM8.25 14.25h4.5v1.5h-4.5z" />
    </svg>
  )
}

function PasswordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 10.5V8.25a4.5 4.5 0 1 1 9 0v2.25h1.5a1.5 1.5 0 0 1 1.5 1.5v6.75a1.5 1.5 0 0 1-1.5 1.5h-12a1.5 1.5 0 0 1-1.5-1.5v-6.75a1.5 1.5 0 0 1 1.5-1.5h1.5Zm1.5 0h6V8.25a3 3 0 1 0-6 0v2.25Z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.5 19 5.5v5.13c0 4.41-3.06 8.47-7 10.37-3.94-1.9-7-5.96-7-10.37V5.5l7-3Z" />
      <path d="M10.84 14.5 8.47 12.13l1.06-1.06 1.31 1.31 3.62-3.62 1.06 1.06-4.68 4.68Z" />
    </svg>
  )
}

function FingerprintBadge() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5a6.5 6.5 0 0 0-6.5 6.5v1.25a.75.75 0 0 0 1.5 0V10a5 5 0 0 1 10 0v1.25a.75.75 0 0 0 1.5 0V10A6.5 6.5 0 0 0 12 3.5Z" />
      <path d="M7.25 11.5a.75.75 0 0 0-.75.75v1.5a5.5 5.5 0 0 0 11 0v-1.5a.75.75 0 0 0-1.5 0v1.5a4 4 0 0 1-8 0v-1.5a.75.75 0 0 0-.75-.75Z" />
      <path d="M12 8.5a2.5 2.5 0 0 0-2.5 2.5v2.25a2.5 2.5 0 0 0 5 0V11a2.5 2.5 0 0 0-2.5-2.5Zm0 1.5a1 1 0 0 1 1 1v2.25a1 1 0 0 1-2 0V11a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function AuthScreen({ onSubmit }: AuthScreenProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <main className="auth-screen">
      <div className="auth-screen__ambient auth-screen__ambient--one" aria-hidden="true" />
      <div className="auth-screen__ambient auth-screen__ambient--two" aria-hidden="true" />

      <section className="auth-shell">
        <header className="auth-brandbar" aria-label="Escudo Financiero">
          <div className="auth-brandbar__emblem" aria-hidden="true">
            <ShieldIcon />
          </div>
          <div>
            <p className="auth-brandbar__eyebrow">Banco Mercantil Santa Cruz</p>
            <h1 className="auth-brandbar__title">Escudo Financiero</h1>
          </div>
        </header>

        <section className="auth-hero card-surface">
          <div className="auth-hero__visual" aria-hidden="true">
            <div className="auth-hero__ring auth-hero__ring--outer" />
            <div className="auth-hero__ring auth-hero__ring--inner" />
            <div className="auth-hero__shield">
              <ShieldIcon />
            </div>
            <div className="auth-hero__badge auth-hero__badge--top">
              <FingerprintBadge />
            </div>
            <div className="auth-hero__badge auth-hero__badge--bottom">
              <span className="auth-hero__badge-dot" />
            </div>
          </div>

          <div className="auth-hero__copy">
            <p className="auth-kicker">Acceso seguro</p>
            <h2>Inicia sesión para continuar</h2>
            <p>
              Ingresa tu carnet de identidad y tu contraseña para acceder a una
              experiencia instalable, clara y protegida.
            </p>
          </div>
        </section>

        <section className="auth-card card-surface">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="carnet">Carnet de identidad</label>
              <div className="auth-input-shell">
                <span className="auth-input-shell__icon" aria-hidden="true">
                  <CardIdIcon />
                </span>
                <input
                  id="carnet"
                  name="carnet"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="Ej. 12345678"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <div className="auth-input-shell">
                <span className="auth-input-shell__icon" aria-hidden="true">
                  <PasswordIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            <button className="auth-submit" type="submit">
              <ShieldIcon />
              Ingresar
            </button>
          </form>

          <div className="auth-support">
            <div className="auth-support__chip">
              <ShieldIcon />
              <span>Conexión cifrada SSL de 256 bits</span>
            </div>

            <p className="auth-support__note">
              Diseñado para pantalla móvil, con instalación tipo PWA y estilo
              institucional.
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}