import React from 'react'

const BurgerLi = (props) => {
  return (
    <li className={props.class}>
        {props.children}
    </li>
  )
}

export default BurgerLi