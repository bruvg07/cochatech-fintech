export type LoginRequest = {
  ci: string
  password: string
}

export type LoginResponse = {
  token: string
  token_type: string
  expires_in: number
  cliente: {
    id: string
    ci: string
    nombre: string
    ciudad?: string | null
  }
}

export type DashboardCredit = {
  id: string
  tipo_credito: string
  monto_original: number
  saldo_pendiente: number
  saldo_mora: number
  cuota_mensual: number
  plazo_meses: number
  dias_mora: number
  estado: string
  fecha_vencimiento?: string | null
}

export type DashboardAlert = {
  id: string
  tipo?: string | null
  urgencia: string
  mensaje?: string | null
  probabilidad_mora?: number | null
  estado: string
}

export type DashboardResponse = {
  cliente: {
    id: string
    nombre: string
    ci: string
    ciudad?: string | null
    ingreso_mensual: number
    calificacion: string
    max_dias_mora: number
  }
  score: {
    numero_creditos: number
    retrasos_totales: number
    promedio_dias_retraso: number
    nivel_riesgo: string
  }
  resumen: {
    total_creditos: number
    saldo_pendiente: number
    saldo_pagado: number
    pagos_registrados: number
    pagos_con_retraso: number
    max_dias_retraso: number
    alertas_activas: number
    acuerdos_activos: number
    casos_abiertos: number
  }
  creditos: DashboardCredit[]
  alertas: DashboardAlert[]
  mensaje: string
}

export type StoredSession = {
  token: string
  cliente: LoginResponse['cliente']
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'
const TOKEN_KEY = 'escudo_financiero_token'
const CLIENT_KEY = 'escudo_financiero_cliente'

export function getStoredSession(): StoredSession | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const clienteRaw = localStorage.getItem(CLIENT_KEY)

  if (!token || !clienteRaw) {
    return null
  }

  try {
    return { token, cliente: JSON.parse(clienteRaw) as StoredSession['cliente'] }
  } catch {
    clearSession()
    return null
  }
}

export function storeSession(session: StoredSession) {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(CLIENT_KEY, JSON.stringify(session.cliente))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CLIENT_KEY)
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & { message?: string }

  if (!response.ok) {
    throw new Error(data?.message ?? 'No se pudo completar la solicitud.')
  }

  return data
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(request),
  })

  return parseJsonResponse<LoginResponse>(response)
}

export async function fetchDashboardInitial(): Promise<DashboardResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const response = await fetch(`${API_BASE_URL}/dashboard/initial`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  return parseJsonResponse<DashboardResponse>(response)
}