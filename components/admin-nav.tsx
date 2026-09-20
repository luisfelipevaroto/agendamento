import Link from 'next/link';

const items = [
  ['Dashboard','/admin'],
  ['Agenda','/admin/agenda'],
  ['Agendamentos','/admin/agendamentos'],
  ['Clientes','/admin/clientes'],
  ['Profissionais','/admin/profissionais'],
  ['Serviços','/admin/servicos'],
  ['Horários','/admin/horarios'],
  ['Integrações','/admin/integracoes'],
  ['Configurações','/admin/configuracoes'],
];

export function AdminNav({ company }: { company: string }) {
  return <aside className="sidebar"><div><strong>AgendaPro</strong><small>{company}</small></div><nav>{items.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav></aside>;
}
