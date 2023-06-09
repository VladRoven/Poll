import React from 'react'
import './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <p>© 2023 Poll</p>
      <nav>
        <ul>
          <li>
            <Link to="/" className="link">
              Головна
            </Link>
          </li>
          <li className="line"></li>
          <li>
            <Link to="/about" className="link">
              Про нас
            </Link>
          </li>
          <li className="line"></li>
          <li>
            <Link to="/profile" className="link">
              Профіль
            </Link>
          </li>
        </ul>
      </nav>
      <div className="social">
        <a href="mailto:vlad.rovenchak@gmail.com">
          <FontAwesomeIcon
            icon={faEnvelope}
            color="#fff"
            size="xl"
            title="Gmail"
          />
        </a>
        <a href="tel:+380983139195">
          <FontAwesomeIcon
            icon={faPhone}
            color="#fff"
            size="lg"
            title="Подзвонити"
          />
        </a>
      </div>
    </footer>
  )
}

export default Footer
