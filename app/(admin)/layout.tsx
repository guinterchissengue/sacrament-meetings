import type { ReactNode } from "react";

// Layout das rotas de liderança (admin).
// TODO (Semana 05): verificar a sessão aqui e redirecionar quem não for líder.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section aria-label="Admin area" className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </section>
  );
}
