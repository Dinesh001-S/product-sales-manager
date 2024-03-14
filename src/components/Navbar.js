import React,{useState} from 'react'
import { NavLink , Link} from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav>
            <Link to='/' className='title'>Shop</Link>
            <div className="menu" onClick={() => {setMenuOpen(!menuOpen)}}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        <ul className={menuOpen ? "open" : ""}>
            <li><NavLink to='/bill'>Bill</NavLink></li>
            <li><NavLink to= '/Inventry'>Inventry</NavLink></li>
            <li><NavLink to='/analytics'>Analytics</NavLink></li>
        </ul>
    </nav>
  )
}

export default Navbar
