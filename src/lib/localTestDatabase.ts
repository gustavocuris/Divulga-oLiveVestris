type Account = { id: string; display_name: string; role: 'admin' | 'partner'; referral_source: string | null; password: string; active: boolean }
type Registration = { id: string; name: string; whatsapp: string; email: string; professional_type: string; clinic_name: string | null; city: string | null; interest: string | null; referral_source: string | null; created_at: string }
type TestState = { accounts: Account[]; registrations: Registration[] }

const storageKey = 'vestris-live-test-database-v1'
const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
const initialState = (): TestState => ({
  accounts: [
    { id: id(), display_name: 'VESTRIS', role: 'admin', referral_source: null, password: 'vestris2026', active: true },
    { id: id(), display_name: 'Dra. Melanie Leite', role: 'partner', referral_source: 'melanie', password: 'melanie2026', active: true },
  ],
  registrations: [],
})

const read = (): TestState => {
  const saved = localStorage.getItem(storageKey)
  if (!saved) return initialState()
  try { return JSON.parse(saved) as TestState } catch { return initialState() }
}
const write = (state: TestState) => localStorage.setItem(storageKey, JSON.stringify(state))
const response = <T>(data: T) => Promise.resolve({ data, error: null })

const dashboard = (password: string) => {
  const state = read()
  const account = state.accounts.find((item) => item.active && item.password === password)
  if (!account) return { authorized: false }
  const registrations = state.registrations.filter((item) => account.role === 'admin' || item.referral_source === account.referral_source)
  const partners = account.role === 'admin' ? state.accounts.filter((item) => item.role === 'partner').map((partner) => ({
    id: partner.id, display_name: partner.display_name, referral_source: partner.referral_source!, active: partner.active,
    registrations_count: state.registrations.filter((item) => item.referral_source === partner.referral_source).length,
  })) : []
  return { authorized: true, account: { display_name: account.display_name, role: account.role, referral_source: account.referral_source }, registrations, partners }
}

export const localTestDatabase = {
  rpc: async (name: string, params: Record<string, string | boolean | null>) => {
    const state = read()
    if (name === 'get_access_dashboard') return response(dashboard(String(params.p_password || '')))
    if (name === 'register_early_access') {
      const source = String(params.p_referral_source || '').trim().toLowerCase() || null
      if (source && !state.accounts.some((account) => account.role === 'partner' && account.active && account.referral_source === source)) return response(false)
      state.registrations.unshift({ id: id(), name: String(params.p_name).trim(), whatsapp: String(params.p_whatsapp).trim(), email: String(params.p_email).trim().toLowerCase(), professional_type: String(params.p_professional_type), clinic_name: params.p_clinic_name as string | null, city: params.p_city as string | null, interest: params.p_interest as string | null, referral_source: source, created_at: new Date().toISOString() })
      write(state)
      return response(true)
    }
    if (name === 'admin_save_partner') {
      const admin = state.accounts.some((account) => account.role === 'admin' && account.active && account.password === params.p_admin_password)
      const source = String(params.p_referral_source || '').trim().toLowerCase()
      if (!admin || !source || String(params.p_partner_password || '').length < 6) return response(false)
      const existing = state.accounts.find((account) => account.role === 'partner' && account.referral_source === source)
      const next = { id: existing?.id || id(), display_name: String(params.p_display_name).trim(), role: 'partner' as const, referral_source: source, password: String(params.p_partner_password), active: true }
      if (existing) Object.assign(existing, next); else state.accounts.push(next)
      write(state)
      return response(true)
    }
    if (name === 'admin_toggle_partner') {
      const admin = state.accounts.some((account) => account.role === 'admin' && account.active && account.password === params.p_admin_password)
      const partner = state.accounts.find((account) => account.role === 'partner' && account.referral_source === String(params.p_referral_source).toLowerCase())
      if (!admin || !partner) return response(false)
      partner.active = Boolean(params.p_active); write(state); return response(true)
    }
    return response(null)
  },
  from: (_table: string) => ({
    insert: async (row: Record<string, unknown>) => {
      const state = read()
      state.registrations.unshift({ id: id(), name: String(row.name || ''), whatsapp: String(row.whatsapp || ''), email: String(row.email || ''), professional_type: String(row.professional_type || ''), clinic_name: row.clinic_name as string | null, city: row.city as string | null, interest: row.interest as string | null, referral_source: (row.referral_source as string | null) || null, created_at: new Date().toISOString() })
      write(state); return { data: null, error: null }
    },
    select: () => ({ order: async () => ({ data: read().registrations, error: null }) }),
    delete: () => ({ eq: async (_column: string, value: string) => { const state = read(); state.registrations = state.registrations.filter((row) => row.id !== value); write(state); return { data: null, error: null } } }),
  }),
}
