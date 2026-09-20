import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin-nav';
import { saveService, toggleService } from './actions';

export default async function Page({ searchParams }: { searchParams: { editar?: string; salvo?: string; erro?: string } }) {
 const supabase=createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login');
 const {data:m}=await supabase.from('company_members').select('company_id, companies(name)').eq('user_id',user.id).limit(1).maybeSingle(); if(!m) redirect('/admin');
 const {data:services}=await supabase.from('services').select('*').eq('company_id',m.company_id).order('name'); const editing=services?.find(s=>s.id===searchParams.editar);
 const rel=m.companies as unknown as {name:string}|{name:string}[]|null; const company=Array.isArray(rel)?rel[0]?.name:rel?.name;
 return <main className="admin-shell"><AdminNav company={company||'Empresa'}/><section className="admin-content"><span className="eyebrow">Serviços</span><h1>Serviços</h1><p>Defina o que será oferecido na agenda, duração e valor.</p>
 {searchParams.salvo&&<div className="success-box">Serviço salvo com sucesso.</div>}{searchParams.erro&&<div className="form-error">Confira nome, duração e valor do serviço.</div>}
 <form action={saveService} className="settings-form compact-form"><input type="hidden" name="id" value={editing?.id||''}/><div className="form-grid"><label>Nome do serviço<input name="name" defaultValue={editing?.name||''} required/></label><label>Duração em minutos<input name="duration_minutes" type="number" min="5" step="5" defaultValue={editing?.duration_minutes||60} required/></label><label>Valor (R$)<input name="price" inputMode="decimal" defaultValue={editing?.price??''} placeholder="150,00"/></label><label>Descrição<input name="description" defaultValue={editing?.description||''}/></label></div><button className="primary-button save-button">{editing?'Salvar alterações':'Adicionar serviço'}</button></form>
 <div className="data-list">{services?.length?services.map(s=><article className="data-row" key={s.id}><div><strong>{s.name}</strong><span>{s.duration_minutes} min {s.price!==null?' • R$ '+Number(s.price).toFixed(2).replace('.',','):''}</span></div><div className="row-actions"><a className="secondary-button small-button" href={'/admin/servicos?editar='+s.id}>Editar</a><form action={toggleService}><input type="hidden" name="id" value={s.id}/><input type="hidden" name="active" value={String(s.active)}/><button className="secondary-button small-button">{s.active?'Desativar':'Ativar'}</button></form><span className={s.active?'status active':'status'}>{s.active?'Ativo':'Inativo'}</span></div></article>):<div className="empty-state">Nenhum serviço cadastrado ainda.</div>}</div>
 </section></main>;
}
