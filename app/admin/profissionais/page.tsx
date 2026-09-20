import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin-nav';
import { saveProfessional, toggleProfessional } from './actions';

export default async function Page({ searchParams }: { searchParams: { editar?: string; salvo?: string; erro?: string } }) {
 const supabase=createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login');
 const {data:m}=await supabase.from('company_members').select('company_id, companies(name)').eq('user_id',user.id).limit(1).maybeSingle(); if(!m) redirect('/admin');
 const {data:professionals}=await supabase.from('professionals').select('*').eq('company_id',m.company_id).order('name');
 const editing=professionals?.find(p=>p.id===searchParams.editar);
 const rel=m.companies as unknown as {name:string}|{name:string}[]|null; const company=Array.isArray(rel)?rel[0]?.name:rel?.name;
 return <main className="admin-shell"><AdminNav company={company||'Empresa'}/><section className="admin-content"><span className="eyebrow">Profissionais</span><h1>Profissionais</h1><p>Cadastre quem poderá receber agendamentos.</p>
 {searchParams.salvo&&<div className="success-box">Profissional salvo com sucesso.</div>}{searchParams.erro&&<div className="form-error">Não foi possível salvar o profissional.</div>}
 <form action={saveProfessional} className="settings-form compact-form"><input type="hidden" name="id" value={editing?.id||''}/><div className="form-grid"><label>Nome<input name="name" defaultValue={editing?.name||''} required/></label><label>E-mail<input name="email" type="email" defaultValue={editing?.email||''}/></label><label>Telefone / WhatsApp<input name="phone" defaultValue={editing?.phone||''}/></label></div><button className="primary-button save-button">{editing?'Salvar alterações':'Adicionar profissional'}</button></form>
 <div className="data-list">{professionals?.length?professionals.map(p=><article className="data-row" key={p.id}><div><strong>{p.name}</strong><span>{p.email||p.phone||'Sem contato cadastrado'}</span></div><div className="row-actions"><a className="secondary-button small-button" href={'/admin/profissionais?editar='+p.id}>Editar</a><form action={toggleProfessional}><input type="hidden" name="id" value={p.id}/><input type="hidden" name="active" value={String(p.active)}/><button className="secondary-button small-button">{p.active?'Desativar':'Ativar'}</button></form><span className={p.active?'status active':'status'}>{p.active?'Ativo':'Inativo'}</span></div></article>):<div className="empty-state">Nenhum profissional cadastrado ainda.</div>}</div>
 </section></main>;
}
