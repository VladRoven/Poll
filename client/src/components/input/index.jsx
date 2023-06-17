import React, { useState } from 'react'
import './style'

const Input = (
  {
    type = 'text',
    min,
    max,
    placeholder = '',
    pattern,
    value,
    style = {},
    onInput = null,
    onChange = () => {},
  },
  ref
) => {
  const [currentValue, setCurrentValue] = useState('')

  return (
    <input
      className="poll-input"
      style={style}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onInput={e => {
        if (onInput) return onInput(e)
        setCurrentValue(e.target.value)
      }}
      pattern={pattern ? pattern.toString().replaceAll('/', '') : null}
      value={value || currentValue}
      min={min || min === 0 ? min : null}
      max={max || max === 0 ? max : null}
      ref={ref}
    />
  )
}

export default React.forwardRef(Input)
