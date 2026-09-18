import { useState } from 'react'
import Particles from './Particles'
import { supabase } from '../lib/supabase'

interface Props { onClose: () => void; referralSource?: string }
interface FormData { name: string; whatsapp: string; email: string }
interface Errors { name?: string; whatsapp?: string; email?: string }

const EarlyAccessForm = ({ onClose, referralSource = '' }: Props) => {
  const [form, setForm] = useState<FormData>({ name: '', whatsapp: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const nextErrors: Errors = {}
    if (!form.name.trim() || form.name.trim().length < 3) nextErrors.name = 'Informe seu nome completo.'
    if (form.whatsapp.replace(/\D/g, '').length < 10) nextErrors.whatsapp = 'Informe um número de telefone válido com DDD.'
    if (!/^[^\s@]+@gmail\.com$/i.test(form.email.trim())) nextErrors.email = 'Informe um endereço do Gmail válido.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target
    let { value } = event.target
    if (name === 'whatsapp') {
      const digits = value.replace(/\D/g, '').slice(0, 11)
      if (digits.length <= 2) value = digits.length ? `(${digits}` : ''
      else if (digits.length <= 7) value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
      else if (digits.length <= 10) value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
      else value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    setForm((previous) => ({ ...previous, [name]: value }))
    if (errors[name as keyof Errors]) setErrors((previous) => ({ ...previous, [name]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    const registration = {
      p_name: form.name.trim(), p_whatsapp: form.whatsapp.trim(), p_email: form.email.trim(),
      p_professional_type: 'Participante da live 26/09', p_clinic_name: null, p_city: null,
      p_interest: 'Live 26/09', p_referral_source: referralSource || null,
    }
    const { data, error } = await supabase.rpc('register_early_access', registration)
    if (error?.code === 'PGRST202' && !referralSource) {
      const { error: fallbackError } = await supabase.from('registrations').insert({
        name: registration.p_name, whatsapp: registration.p_whatsapp, email: registration.p_email,
        professional_type: registration.p_professional_type, clinic_name: null, city: null, interest: registration.p_interest,
      })
      setLoading(false)
      if (!fallbackError) { setSubmitted(true); return }
      alert('Não foi possível concluir sua inscrição. Tente novamente.')
      return
    }
    setLoading(false)
    if (!error && data === true) setSubmitted(true)
    else if (!error && data === false) alert('Este link não está ativo. Solicite um novo link.')
    else alert('Não foi possível concluir sua inscrição. Verifique a configuração do banco de dados.')
  }

  return <div className="form-screen"><Particles />
    <nav className="form-screen-nav"><div className="form-screen-logo">VEST<span>RIS</span></div><button className="form-screen-close" onClick={onClose}>Voltar</button></nav>
    <div className="form-screen-body"><div className="form-screen-inner">
      <div className="form-screen-header"><p className="section-eyebrow">Live exclusiva</p><h2 className="section-title">Participe da nossa live<br /><em>no dia 26/09</em></h2><p className="section-desc">Preencha seus dados para garantir sua participação.</p></div>
      <div className="form-card">{submitted ? <div className="success-message"><h3>Inscrição realizada!</h3><p>Sua participação na live do dia 26/09 está confirmada.<br />Em breve enviaremos mais informações.</p><button className="success-back-btn" onClick={onClose}>Voltar à página</button></div> : <form onSubmit={handleSubmit} noValidate>
        <div className="form-field"><label htmlFor="name">Nome completo <span className="required">*</span></label><input id="name" name="name" type="text" placeholder="Seu nome completo" value={form.name} onChange={handleChange} className={errors.name ? 'error' : ''} autoComplete="name" />{errors.name && <p className="form-error-msg">{errors.name}</p>}</div>
        <div className="form-field"><label htmlFor="whatsapp">Número de telefone <span className="required">*</span></label><input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" value={form.whatsapp} onChange={handleChange} className={errors.whatsapp ? 'error' : ''} autoComplete="tel" />{errors.whatsapp && <p className="form-error-msg">{errors.whatsapp}</p>}</div>
        <div className="form-field"><label htmlFor="email">Gmail <span className="required">*</span></label><input id="email" name="email" type="email" placeholder="seuemail@gmail.com" value={form.email} onChange={handleChange} className={errors.email ? 'error' : ''} autoComplete="email" />{errors.email && <p className="form-error-msg">{errors.email}</p>}</div>
        <button type="submit" className="btn-form" disabled={loading}>{loading ? 'Enviando...' : 'Participar da live'}</button>
      </form>}</div>
    </div></div>
  </div>
}

export default EarlyAccessForm
