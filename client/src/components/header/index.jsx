import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './style'
import { useLocation } from 'react-router-dom'
import Button from '../button'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleUser,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'

const Header = inject('User')(
  observer(({ User, ...props }) => {
    const pageScroll = useRef(0)
    const header = useRef()
    const { pathname: currentPage } = useLocation()
    const listNav = useMemo(() => [
      {
        title: 'Головна',
        path: '/',
      },
      {
        title: 'Про нас',
        path: '/about',
      },
    ])
    const auth = !!User.token

    useEffect(() => {
      const handlerScroll = () => {
        if (!header.current) return
        if (
          window.scrollY >= 150 &&
          !header.current.classList.contains('toggle')
        )
          header.current.classList.add('toggle')
        if (window.scrollY < 150 && header.current.classList.contains('toggle'))
          header.current.classList.remove('toggle')
        if (
          window.scrollY >= 250 &&
          pageScroll.current < window.scrollY &&
          !header.current.classList.contains('hide')
        )
          header.current.classList.add('hide')
        if (
          pageScroll.current > window.scrollY &&
          header.current.classList.contains('hide')
        )
          header.current.classList.remove('hide')
        pageScroll.current = window.scrollY
      }
      document.addEventListener('scroll', handlerScroll)

      return () => {
        document.removeEventListener('scroll', handlerScroll)
      }
    }, [])

    return (
      <header ref={header}>
        <Link to="/" className="logo">
          Poll
        </Link>
        <nav className="navigate">
          <ul>
            {listNav.map(({ title, path }, index) => (
              <li
                className={currentPage === path ? 'active' : ''}
                key={`${title}-${index}`}
              >
                <Link to={path} className="link">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {auth ? (
          <div className="user-menu">
            <Link to="/profile">
              <FontAwesomeIcon
                title="Профіль"
                size="2x"
                icon={faCircleUser}
                id="user-img"
              />
            </Link>
          </div>
        ) : (
          <div className="sign">
            <Link to="/sign-up">
              <Button>Зареєструватись</Button>
            </Link>
            <Link to="/sign-in" className="link">
              Увійти
            </Link>
          </div>
        )}
      </header>
    )
  })
)

export default Header
