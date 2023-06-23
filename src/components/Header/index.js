import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {history} = props
  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <div className="navContainer">
        <Link to="/">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="iconsContainer">
          <li>
            <Link to="/">
              <AiFillHome color="#fff" size="30px" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <BsFillBriefcaseFill color="#fff" size="30px" />
            </Link>
          </li>
          <li>
            <FiLogOut color="#fff" size="30px" onClick={onLogout} />
          </li>
        </ul>
        <div className="linksContainer">
          <Link className="LinkStyle" to="/">
            Home
          </Link>
          <Link className="LinkStyle" to="/jobs">
            Jobs
          </Link>
        </div>
        <button type="button" className="logoutBtn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
