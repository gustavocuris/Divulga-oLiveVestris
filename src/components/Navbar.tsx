interface Props {
  openForm: () => void
}

const Navbar = ({ openForm }: Props) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src={vestrisLeafLogo}
          alt="VESTRIS"
          className="navbar-logo-img"
        />
      </div>
      <button className="navbar-cta" onClick={openForm}>
        Quero participar
      </button>
    </nav>
  )
}

export default Navbar
import vestrisLeafLogo from '../assets/vestris-leaf-logo.png'
