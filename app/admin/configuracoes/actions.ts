'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function updateCompany(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase.from('company_members').select('company_id, role').eq('user_id', user.id).limit(1).maybeSingle();
  if (!membership || !['owner','admin'].includes(membership.role)) redirect('/admin');

  const payload = {
    name: String(formData.get('name') || '').trim(),
    business_type: String(formData.get('business_type') || '').trim() || null,
    phone: String(formData.get('phone') || '').trim() || null,
    email: String(formData.get('email') || '').trim() || null,
    address: String(formData.get('address') || '').trim() || null,
    logo_url: String(formData.get('logo_url') || '').trim() || null,
    primary_color: String(formData.get('primary_color') || '#111827'),
  };

  if (!payload.name) redirect('/admin/configuracoes?erro=nome');

  const { error } = await supabase.from('companies').update(payload).eq('id', membership.company_id);
  if (error) redirect('/admin/configuracoes?erro=salvar');

  revalidatePath('/admin');
  revalidatePath('/admin/configuracoes');
  redirect('/admin/configuracoes?salvo=1');
}
