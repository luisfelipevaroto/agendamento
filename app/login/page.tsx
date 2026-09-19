'use client';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage(){
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
 async function submit(e:FormEvent){ e.preventDefault(); setLoading(true); setError(''); const {error}=await createClient().auth.signInWithPassword({email,password}); if(error){setError('E-mail ou senha inválidos.');setLoading(false);return;} router.push('/admin'); router.refresh(); }
 return <main className="page-shell"><section className="hero-card login-card"><span className="eyebrow">Painel administrativo</span><h1>Entrar</h1><p>Acesse sua agenda, clientes, profissionais e configurações.</p><form className="login-form" onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>{error&&<div className="form-error">{error}</div>}<button className="primary-button" disabled={loading}>{loading?'Entrando...':'Entrar'}</button></form></section></main>;
}
