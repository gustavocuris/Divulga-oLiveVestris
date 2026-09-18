import liveBackground from '../assets/live-botanical-background.png'

interface Props { openForm: () => void }

const Hero = ({ openForm }: Props) => (
  <section className="live-hero" style={{ backgroundImage: `url(${liveBackground})` }}>
    <div className="live-hero-content">
      <p className="live-date">26 de setembro</p>
      <p className="live-kicker">Uma conversa ao vivo para quem cuida de silvestres e exóticos</p>
      <h1><span>LIVE</span><svg viewBox="0 0 720 160" role="img" aria-label="Vestris"><defs><linearGradient id="hero-vestris-green" x1="0" x2="1"><stop offset="0%" stopColor="#0b3d1d" /><stop offset="35%" stopColor="#145426" /><stop offset="70%" stopColor="#277d30" /><stop offset="100%" stopColor="#4b9c35" /></linearGradient></defs><text x="360" y="128" textAnchor="middle" fill="url(#hero-vestris-green)">VESTRIS</text></svg></h1>
      <p className="live-intro">Vamos mostrar o <strong>sistema</strong>, compartilhar <strong>dicas de uso</strong> e tirar <strong>dúvidas ao vivo</strong>.</p>
      <div className="live-pills"><span>Apresentação do sistema</span><span>Dicas práticas</span><span>Perguntas ao vivo</span></div>
      <button className="live-cta" onClick={openForm}><span>Quero participar</span><b>→</b></button>
      <a className="scroll-cue" href="#agenda">Veja o que vamos falar <span>↓</span></a>
    </div>
  </section>
)

export default Hero
