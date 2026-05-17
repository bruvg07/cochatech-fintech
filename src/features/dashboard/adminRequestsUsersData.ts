export type AdminUserCard = {
  name: string
  ci: string
  score: 'A' | 'B' | 'C' | 'D' | 'E'
}

export type AdminRequestItem = {
  id: string
  title: string
  ci: string
  priority: 'Alta' | 'Media'
  type: string
  origin: string
  reason: string
}

export const ADMIN_USERS: AdminUserCard[] = [
  { name: 'Sarah Tancara', ci: '12345', score: 'A' },
  { name: 'Jose Elias', ci: '24680', score: 'B' },
  { name: 'Marta Quispe', ci: '35791', score: 'C' },
  { name: 'Luis Mercado', ci: '46802', score: 'D' },
  { name: 'Ana Flores', ci: '57913', score: 'E' },
  { name: 'Carlos Rojas', ci: '68024', score: 'B' },
  { name: 'Paola Gutierrez', ci: '79135', score: 'A' },
  { name: 'Jorge Arce', ci: '80246', score: 'C' },
  { name: 'Valeria Soria', ci: '91357', score: 'D' },
]

export const ADMIN_REQUESTS: AdminRequestItem[] = [
  {
    id: 'r1',
    title: 'Renegociación de CI: 12345',
    ci: '12345',
    priority: 'Alta',
    type: 'Período de Gracia',
    origin: 'Deuda 1',
    reason:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero sed cursus ante dapibus diam.',
  },
  {
    id: 'r2',
    title: 'Actualización de datos de CI: 24680',
    ci: '24680',
    priority: 'Media',
    type: 'Actualización de Datos',
    origin: 'Deuda 2',
    reason:
      'Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.',
  },
  {
    id: 'r3',
    title: 'Solicitud de revisión de CI: 79135',
    ci: '79135',
    priority: 'Alta',
    type: 'Revisión Manual',
    origin: 'Deuda 3',
    reason:
      'Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.',
  },
]

export function getAdminUserByCi(ci?: string) {
  return ADMIN_USERS.find((user) => user.ci === ci)
}

export function getAdminRequestByCi(ci?: string) {
  return ADMIN_REQUESTS.find((request) => request.ci === ci)
}