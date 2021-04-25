import React from 'react';

const Button = ({ name, onClick, active }) => {
  return (
    <button onClick={onClick} disabled={!active} >{name}</button>
  )
}

export default Button;