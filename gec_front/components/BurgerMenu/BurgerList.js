import React from 'react'

const BurgerList = (props) => {
  return (
    <ul className={props.class}>
    {props.children}
</ul>
  )
}

export default BurgerList