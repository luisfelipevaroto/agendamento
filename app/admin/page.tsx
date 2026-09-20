import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin-nav';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase.from('company_members').select('role, companies(name)').eq('user_id', user.id).limit(1).maybeSingle();
  if (!membership) return <main className="page-shell"><section className="hero-card"><h1>Usuário sem empresa</h1><p>Seu usuário ainda não está vinculado a uma empresa.</p></section></main>;

  const relation = membership.companies as unknown as { name: string } | { name: string }[] | null;
  const company = Array.isArray(relation) ? relation[0]?.name : relation?.name;

  const [{ count: clients }, { count: professionals }] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('professionals').select('*', { count: 'exact', head: true }),
  ]);

  return <main className="admin-shell"><AdminNav company={company ?? 'Empresa'} /><section className="admin-content"><span className="eyebrow">Dashboard</span><h1>Olá, Luis Felipe.</h1><p>Seu painel está conectado ao Supabase. Configure sua empresa e depois cadastre profissionais, serviços e horários.</p><div className="quick-actions"><a className="primary-button" href="/admin/configuracoes">Configurar empresa</a></div><div className="stats"><article><b>0</b><span>Agendamentos hoje</span></article><article><b>{clients ?? 0}</b><span>Clientes</span></article><article><b>{professionals ?? 0}</b><span>Profissionais</span></article></div></section></main>;
}
