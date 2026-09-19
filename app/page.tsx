export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">AgendaPro</span>
        <h1>Agendamentos simples para empresas e profissionais.</h1>
        <p>
          Base inicial do sistema criada com Next.js e preparada para integração com Supabase,
          múltiplas empresas, profissionais, serviços e horários.
        </p>
        <div className="actions">
          <a className="primary-button" href="/admin">Acessar painel</a>
          <a className="secondary-button" href="/agendar">Fazer agendamento</a>
        </div>
      </section>
    </main>
  );
}
