import React from 'react'

const ValidInput = (props) => {
  return (
    <input type={props.type} required id={props.id} className={props.class}/>
  )
}

export default ValidInput;