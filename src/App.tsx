import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import WhyItMatters from './components/WhyItMatters'
import EarlyAccessForm from './components/EarlyAccessForm'
import Footer from './components/Footer'

function App() {
  const referralSource = new URLSearchParams(window.location.search).get('ref') || ''
  const [showForm, setShowForm] = useState(() => Boolean(referralSource))
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  return <div className="app live-page">
    <Navbar openForm={openForm} />
    <Hero openForm={openForm} />
    <WhyItMatters />
    <Features />
    <section className="live-final-cta"><p className="live-section-kicker">Inscrição gratuita</p><h2>Garanta a sua participação na <em>Live Vestris.</em></h2><button className="live-cta" onClick={openForm}><span>Participar da live</span><b>→</b></button></section>
    <Footer />
    {showForm && <EarlyAccessForm onClose={closeForm} referralSource={referralSource} />}
  </div>
}

export default App
