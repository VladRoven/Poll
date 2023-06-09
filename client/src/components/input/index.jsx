import React from 'react'
import './style'

const Input = (
  { type = 'text', placeholder = '', style = {}, onChange = () => {} },
  ref
) => {
  return (
    <input
      className="poll-input"
      style={style}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
    />
  )
}

export default React.forwardRef(Input)
