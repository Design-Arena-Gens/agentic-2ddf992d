import Link from "next/link";

const sections = [
  {
    title: "Soma",
    description:
      "A adição reúne quantidades. Trabalhamos com ideias de juntar, somar e acrescentar, incluindo uso de material dourado e diagramas de barras.",
    focus: [
      "Propriedades: comutativa, associativa e elemento neutro",
      "Estratégias: decomposição e reagrupamento",
      "Aplicações: situações de combinação e acréscimo"
    ]
  },
  {
    title: "Subtração",
    description:
      "A subtração trata de retirar, comparar e completar. Exploramos a relação com a adição e estratégias visuais com retas numéricas.",
    focus: [
      "Modelos: retirar, comparar, completar",
      "Uso de retas numéricas e diagramas de part-whole",
      "Verificação por meio da adição"
    ]
  },
  {
    title: "Multiplicação",
    description:
      "Multiplicar é somar parcelas iguais. Construímos significados com matrizes, arranjos e padrões repetitivos no cotidiano.",
    focus: [
      "Propriedades: comutativa, associativa e distributiva",
      "Relação com adição sucessiva e área",
      "Tabelas de multiplicação e padrões"
    ]
  },
  {
    title: "Divisão",
    description:
      "Dividir reparte ou mede. Trabalhamos estratégias por distribuição em partes iguais e por medida, inclusive com restos.",
    focus: [
      "Modelos: partilha e medida",
      "Fatos fundamentais relacionados à multiplicação",
      "Interpretação de resto e estimativa"
    ]
  }
];

const contextualExercises = [
  {
    title: "Organização da Biblioteca",
    description:
      "A turma recebeu 126 livros novos e precisa organizá-los em prateleiras com 9 nichos iguais. Monte o esquema de distribuição, identifique quantos livros ficam em cada nicho e se sobra algum.",
    skill: "Divisão / Multiplicação" 
  },
  {
    title: "Festival de Sorvetes",
    description:
      "Uma sorveteria oferece 4 sabores básicos e lançou 3 sabores sazonais. Quantas combinações diferentes de duas bolas podem ser feitas? Utilize um diagrama de árvore e registre a contagem.",
    skill: "Adição / Multiplicação"
  },
  {
    title: "Circuito de Corrida",
    description:
      "Em um circuito retangular, cada volta possui 850 m. Uma equipe treinou 12 voltas. Represente graficamente a evolução da distância rodada a cada volta e calcule a quilometragem total.",
    skill: "Multiplicação / Adição"
  },
  {
    title: "Feira Solidária",
    description:
      "Estudantes montaram kits com 6 itens. Eles arrecadaram 284 itens no total. Construa uma tabela estimativa para saber quantos kits completos podem montar e quantos itens sobram.",
    skill: "Divisão / Subtração"
  }
];

export default function Page() {
  return (
    <main style={{ padding: "4rem 1.5rem", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "960px", width: "100%", display: "flex", flexDirection: "column", gap: "3rem" }}>
        <header className="hero">
          <div className="hero-card">
            <span className="badge">Apostila Didática</span>
            <h1 style={{ fontSize: "2.75rem", margin: "1rem 0" }}>
              Operações Fundamentais com <span className="highlight">Números Naturais</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.6 }}>
              Material completo com teoria visual, exemplos resolvidos, quadros comparativos e uma coleção de exercícios graduados. Ideal para revisão e aulas investigativas.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
              <Link className="button" href="/api/apostila" prefetch={false}>
                Baixar PDF
              </Link>
              <Link className="button" href="#sumario">
                Ver Conteúdo
              </Link>
            </div>
          </div>
          <div className="diagram" aria-hidden>
            <svg viewBox="0 0 320 320" role="img">
              <title>Visual das operações</title>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2b7a78" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3aafa9" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <rect x="40" y="50" width="80" height="80" fill="url(#grad)" rx="18" />
              <rect x="140" y="50" width="140" height="18" fill="#def2f1" rx="9" />
              <rect x="140" y="88" width="110" height="18" fill="#def2f1" rx="9" />
              <circle cx="100" cy="210" r="52" fill="#def2f1" />
              <circle cx="100" cy="210" r="35" fill="#3aafa9" fillOpacity="0.75" />
              <polyline points="180,180 260,180 260,260 180,260" fill="none" stroke="#2b7a78" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <text x="80" y="95" fill="#fff" fontSize="42" fontWeight="bold">4</text>
              <text x="150" y="63" fill="#2b7a78" fontSize="18" fontWeight="600">+ 8</text>
              <text x="150" y="101" fill="#2b7a78" fontSize="18" fontWeight="600">+ 6</text>
              <text x="82" y="215" fill="#fff" fontSize="32" fontWeight="600">×</text>
              <text x="210" y="225" fill="#2b7a78" fontSize="42" fontWeight="700">÷</text>
            </svg>
          </div>
        </header>

        <section id="sumario" className="grid grid-2">
          {sections.map((section) => (
            <article key={section.title} className="hero-card" style={{ padding: "1.75rem" }}>
              <h2 className="section-title" style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
                {section.title}
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{section.description}</p>
              <ul style={{ marginTop: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{section.focus.map((item) => (
                <li key={item} style={{ marginBottom: "0.4rem" }}>• {item}</li>
              ))}</ul>
            </article>
          ))}
        </section>

        <section className="hero-card">
          <h2 className="section-title" style={{ fontSize: "2rem" }}>O que você encontra no PDF</h2>
          <div className="grid grid-2">
            <article className="exercise-card">
              <h3 style={{ marginTop: 0 }}>Mapas Conceituais</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Diagramas comparativos das operações, fluxos de resolução e relações entre adição-subtração e multiplicação-divisão, com ícones e setas explicativas.
              </p>
            </article>
            <article className="exercise-card">
              <h3 style={{ marginTop: 0 }}>Exemplos Resolvidos</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Passo a passo com destaque para estratégias mentais, algoritmos tradicionais e técnicas de estimativa com destaque visual.
              </p>
            </article>
            <article className="exercise-card">
              <h3 style={{ marginTop: 0 }}>Gráficos e Diagramas</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Retas numéricas, gráficos de barras e modelos de área construídos usando elementos vetoriais consistentes para apoiar diferentes estilos de aprendizagem.
              </p>
            </article>
            <article className="exercise-card">
              <h3 style={{ marginTop: 0 }}>Exercícios Contextualizados</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Situações cotidianas, desafios investigativos, problemas passo a passo e cartões de revisão com autoavaliação.
              </p>
            </article>
          </div>
        </section>

        <section className="hero-card">
          <h2 className="section-title">Exercícios em Destaque</h2>
          <div className="grid grid-2">
            {contextualExercises.map((exercise) => (
              <article key={exercise.title} className="exercise-card">
                <h3 style={{ marginTop: 0 }}>{exercise.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{exercise.description}</p>
                <span className="badge">{exercise.skill}</span>
              </article>
            ))}
          </div>
        </section>

        <footer className="footer">
          Baixe a apostila completa em PDF para acessar o conteúdo completo, imprimir e utilizar em sala de aula.
        </footer>
      </div>
    </main>
  );
}
