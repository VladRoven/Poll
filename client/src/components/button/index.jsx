import React from 'react'
import './style'

const Button = ({ children, onClick = () => {}, style = {}, id = null }) => {
  return (
    <button className="poll-button" id={id} onClick={onClick} style={style}>
      {children}
    </button>
  )
}

export default Button
