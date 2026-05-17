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

export type CreditDetailPayment = {
  id: string
  title: string
  amount: number
  due_date: string
  debt_id: string
  requires_justification: boolean
  estado: string
  canal?: string | null
  fecha_pago?: string | null
  dias_atraso?: number
}

export type CreditAgreement = {
  id: string
  tipo: string
  monto_deuda: number
  descuento_mora: number
  nuevo_plazo_meses?: number | null
  nueva_cuota?: number | null
  estado: string
  fecha_inicio?: string | null
  fecha_fin?: string | null
}

export type CreditCase = {
  id: string
  estado: string
  prioridad: number
  dias_mora: number
  monto_en_mora: number
  notas?: string | null
  gestor_nombre?: string | null
  fecha_apertura?: string | null
  fecha_cierre?: string | null
}

export type RegisterPaymentRequest = {
  amount: number
  title: string
  due_date: string
  requires_justification: boolean
  justification?: string
}

export type RegisterPaymentResponse = {
  message: string
  payment: CreditDetailPayment & {
    estado: string
    fecha_pago?: string | null
    dias_atraso?: number
  }
}

export type ExtensionRequest = {
  new_plazo_meses: number
  motivo: string
}

export type ExtensionResponse = {
  message: string
  solicitud: {
    id: string
    credito_id: string
    cliente_id: string
    tipo: string
    monto_deuda: number
    nuevo_plazo_meses: number
    nueva_cuota: number
    estado: string
    fecha_inicio?: string | null
  }
}

export type CreditDetailResponse = {
  cliente: {
    id: string
    nombre: string
    ci: string
    ciudad?: string | null
    ingreso_mensual: number
    calificacion: string
    max_dias_mora: number
  }
  credito: DashboardCredit & {
    tasa_interes: number
    fecha_inicio?: string | null
  }
  resumen: {
    saldo_pendiente: number
    saldo_mora: number
    saldo_pagado: number
    pagos_registrados: number
    pagos_con_retraso: number
    alertas_activas: number
    acuerdos_totales: number
    acuerdos_activos: number
    acuerdos_pendientes: number
    casos_abiertos: number
  }
  pagos_realizados: CreditDetailPayment[]
  proximas_cuotas: CreditDetailPayment[]
  alertas: DashboardAlert[]
  acuerdos: CreditAgreement[]
  caso: CreditCase | null
  mensaje: string
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

export type AdminGradeRow = {
  grade: string
  count: number
}

export type AdminDashboardResponse = {
  filters: {
    year: number
    month: number
    city: string
  }
  grades: AdminGradeRow[]
  summary: {
    total_clientes: number
    total_creditos: number
    mora_total: number
    retrasos_totales: number
    promedio_dias_retraso: number
    scores_registrados: number
  }
  insight: string
}

export type AdminUserCard = {
  name: string
  ci: string
  score: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
}

export type AdminRequestItem = {
  id: string
  title: string
  ci: string
  priority: 'Alta' | 'Media'
  type: string
  origin: string
  reason: string
  status: string
}

export type AdminRequestsUsersResponse = {
  users: AdminUserCard[]
  requests: AdminRequestItem[]
}

export type AdminUserDetailResponse = {
  user: AdminUserCard
  credit: {
    name: string
    id?: string | null
  }
  rows: Array<{
    cuota: string
    calific: string
    justificacion: string
  }>
  request: {
    id: string
    title: string
    type: string
    origin: string
    reason: string
    status: string
  } | null
}

export type StoredSession = {
  token: string
  cliente: LoginResponse['cliente']
  role: 'user' | 'admin'
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'
const TOKEN_KEY = 'escudo_financiero_token'
const CLIENT_KEY = 'escudo_financiero_cliente'
const ROLE_KEY = 'escudo_financiero_role'

export function getStoredSession(): StoredSession | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const clienteRaw = localStorage.getItem(CLIENT_KEY)
  const roleRaw = localStorage.getItem(ROLE_KEY)

  if (!token || !clienteRaw || !roleRaw) {
    return null
  }

  try {
    const role = roleRaw === 'admin' ? 'admin' : roleRaw === 'user' ? 'user' : null

    if (!role) {
      clearSession()
      return null
    }

    return { token, cliente: JSON.parse(clienteRaw) as StoredSession['cliente'], role }
  } catch {
    clearSession()
    return null
  }
}

export function storeSession(session: StoredSession) {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(CLIENT_KEY, JSON.stringify(session.cliente))
  localStorage.setItem(ROLE_KEY, session.role)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CLIENT_KEY)
  localStorage.removeItem(ROLE_KEY)
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

export async function fetchCreditDetail(creditId: string): Promise<CreditDetailResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const response = await fetch(`${API_BASE_URL}/creditos/${creditId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  return parseJsonResponse<CreditDetailResponse>(response)
}

export async function registerCreditPayment(creditId: string, request: RegisterPaymentRequest): Promise<RegisterPaymentResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const response = await fetch(`${API_BASE_URL}/creditos/${creditId}/pagos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(request),
  })

  return parseJsonResponse<RegisterPaymentResponse>(response)
}

export async function requestCreditExtension(creditId: string, request: ExtensionRequest): Promise<ExtensionResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const response = await fetch(`${API_BASE_URL}/creditos/${creditId}/ampliacion-plazo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(request),
  })

  return parseJsonResponse<ExtensionResponse>(response)
}

export async function fetchAdminDashboard(filters?: { year?: number; month?: number; city?: string }): Promise<AdminDashboardResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const params = new URLSearchParams()

  if (filters?.year) {
    params.set('year', String(filters.year))
  }

  if (filters?.month) {
    params.set('month', String(filters.month))
  }

  if (filters?.city) {
    params.set('city', filters.city)
  }

  const query = params.toString()
  const response = await fetch(`${API_BASE_URL}/admin/dashboard${query ? `?${query}` : ''}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  return parseJsonResponse<AdminDashboardResponse>(response)
}

export async function fetchAdminRequestsUsers(ci?: string): Promise<AdminRequestsUsersResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const query = ci ? `?ci=${encodeURIComponent(ci)}` : ''
  const response = await fetch(`${API_BASE_URL}/admin/requests-users${query}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  return parseJsonResponse<AdminRequestsUsersResponse>(response)
}

export async function fetchAdminUserDetail(ci: string): Promise<AdminUserDetailResponse> {
  const session = getStoredSession()

  if (!session) {
    throw new Error('No hay una sesión activa.')
  }

  const response = await fetch(`${API_BASE_URL}/admin/requests-users/${ci}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  return parseJsonResponse<AdminUserDetailResponse>(response)
}
