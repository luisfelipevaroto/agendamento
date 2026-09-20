import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin-nav';
import { updateCompany } from './actions';

export default async function ConfiguracoesPage({ searchParams }: { searchParams: { salvo?: string; erro?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase.from('company_members').select('company_id, role, companies(*)').eq('user_id', user.id).limit(1).maybeSingle();
  if (!membership) redirect('/admin');
  const rel = membership.companies as unknown as Record<string, string | null> | Record<string, string | null>[] | null;
  const company = Array.isArray(rel) ? rel[0] : rel;
  if (!company) redirect('/admin');

  return <main className="admin-shell"><AdminNav company={company.name || 'Empresa'} /><section className="admin-content"><span className="eyebrow">Configurações</span><h1>Dados da empresa</h1><p>Essas informações serão usadas no painel e poderão alimentar a landing page pública.</p>
  {searchParams.salvo && <div className="success-box">Configurações salvas com sucesso.</div>}
  {searchParams.erro && <div className="form-error">Não foi possível salvar. Confira os dados e tente novamente.</div>}
  <form action={updateCompany} className="settings-form">
    <div className="form-grid">
      <label>Nome da empresa/profissional<input name="name" defaultValue={company.name || ''} required /></label>
      <label>Segmento<input name="business_type" defaultValue={company.business_type || ''} placeholder="Ex.: Nutricionista, Clínica, Barbearia" /></label>
      <label>Telefone / WhatsApp<input name="phone" defaultValue={company.phone || ''} /></label>
      <label>E-mail<input name="email" type="email" defaultValue={company.email || ''} /></label>
    </div>
    <label>Endereço<input name="address" defaultValue={company.address || ''} /></label>
    <label>URL da logo<input name="logo_url" type="url" defaultValue={company.logo_url || ''} placeholder="https://..." /></label>
    <label className="color-field">Cor principal<input name="primary_color" type="color" defaultValue={company.primary_color || '#111827'} /></label>
    <button className="primary-button save-button" type="submit">Salvar configurações</button>
  </form></section></main>;
}
