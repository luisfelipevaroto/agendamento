'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function context() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: membership } = await supabase.from('company_members').select('company_id').eq('user_id', user.id).limit(1).maybeSingle();
  if (!membership) redirect('/admin');
  return { supabase, companyId: membership.company_id };
}

export async function saveProfessional(formData: FormData) {
  const { supabase, companyId } = await context();
  const id = String(formData.get('id') || '');
  const payload = { company_id: companyId, name: String(formData.get('name') || '').trim(), email: String(formData.get('email') || '').trim() || null, phone: String(formData.get('phone') || '').trim() || null };
  if (!payload.name) redirect('/admin/profissionais?erro=nome');
  const result = id ? await supabase.from('professionals').update(payload).eq('id', id).eq('company_id', companyId) : await supabase.from('professionals').insert(payload);
  if (result.error) redirect('/admin/profissionais?erro=salvar');
  revalidatePath('/admin/profissionais'); revalidatePath('/admin'); redirect('/admin/profissionais?salvo=1');
}

export async function toggleProfessional(formData: FormData) {
  const { supabase, companyId } = await context();
  const id = String(formData.get('id')); const active = String(formData.get('active')) === 'true';
  await supabase.from('professionals').update({ active: !active }).eq('id', id).eq('company_id', companyId);
  revalidatePath('/admin/profissionais'); revalidatePath('/admin');
}
