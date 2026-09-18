const TOPICS = [
  { number: '01', title: 'Apresentação do sistema', text: 'Conheça a Vestris e veja como a plataforma organiza informações essenciais para a rotina clínica.' },
  { number: '02', title: 'Dicas práticas de uso', text: 'Vamos mostrar, passo a passo, recursos que ajudam a ganhar tempo no dia a dia.' },
  { number: '03', title: 'Tire suas dúvidas ao vivo', text: 'Envie suas perguntas e converse diretamente com o nosso time durante a transmissão.' },
]

const WhyItMatters = () => (
  <section className="live-agenda" id="agenda">
    <p className="live-section-kicker">Programação da live</p>
    <h2>O que vamos conversar <em>no dia 26/09</em></h2>
    <p className="live-section-intro">Uma apresentação pensada para deixar a Vestris mais próxima da sua prática.</p>
    <div className="live-topic-grid">
      {TOPICS.map((topic) => <article className="live-topic" key={topic.number}>
        <span>{topic.number}</span><h3>{topic.title}</h3><p>{topic.text}</p>
      </article>)}
    </div>
  </section>
)

export default WhyItMatters
