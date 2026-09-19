import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('company_members')
    .select('role, companies(name)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return <main className="page-shell"><section className="hero-card"><h1>Usuário sem empresa</h1><p>Seu usuário ainda não está vinculado a uma empresa.</p></section></main>;
  }

  const relation = membership.companies as unknown as { name: string } | { name: string }[] | null;
  const company = Array.isArray(relation) ? relation[0]?.name : relation?.name;

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div><strong>AgendaPro</strong><small>{company ?? 'Empresa'}</small></div>
        <nav>
          {['Dashboard','Agenda','Agendamentos','Clientes','Profissionais','Serviços','Horários','Integrações','Configurações'].map((item) => <a key={item} href="#">{item}</a>)}
        </nav>
      </aside>
      <section className="admin-content">
        <span className="eyebrow">Dashboard</span>
        <h1>Olá, Luis Felipe.</h1>
        <p>Seu painel está conectado ao Supabase. Agora podemos cadastrar profissionais, serviços e horários.</p>
        <div className="stats">
          <article><b>0</b><span>Agendamentos hoje</span></article>
          <article><b>0</b><span>Clientes</span></article>
          <article><b>0</b><span>Profissionais</span></article>
        </div>
      </section>
    </main>
  );
}
