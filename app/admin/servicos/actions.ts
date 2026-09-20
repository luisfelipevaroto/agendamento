'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function context() {
 const supabase=createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login');
 const {data:m}=await supabase.from('company_members').select('company_id').eq('user_id',user.id).limit(1).maybeSingle(); if(!m) redirect('/admin');
 return {supabase,companyId:m.company_id};
}

export async function saveService(formData: FormData) {
 const {supabase,companyId}=await context(); const id=String(formData.get('id')||''); const name=String(formData.get('name')||'').trim();
 const duration=Number(formData.get('duration_minutes')); const priceRaw=String(formData.get('price')||'').replace(',','.');
 if(!name||!Number.isInteger(duration)||duration<=0) redirect('/admin/servicos?erro=dados');
 const payload={company_id:companyId,name,description:String(formData.get('description')||'').trim()||null,duration_minutes:duration,price:priceRaw?Number(priceRaw):null};
 const result=id?await supabase.from('services').update(payload).eq('id',id).eq('company_id',companyId):await supabase.from('services').insert(payload);
 if(result.error) redirect('/admin/servicos?erro=salvar'); revalidatePath('/admin/servicos'); redirect('/admin/servicos?salvo=1');
}

export async function toggleService(formData: FormData) {
 const {supabase,companyId}=await context(); const id=String(formData.get('id')); const active=String(formData.get('active'))==='true';
 await supabase.from('services').update({active:!active}).eq('id',id).eq('company_id',companyId); revalidatePath('/admin/servicos');
}
