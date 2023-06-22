import React from 'react'
import './style'

const Button = ({
  children,
  className = '',
  onClick = () => {},
  style = {},
  id = null,
}) => {
  return (
    <button
      className={`poll-button ${className}`}
      id={id}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}

export default Button
