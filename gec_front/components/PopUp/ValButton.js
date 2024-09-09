import React from 'react'

const ValButton = (props) => { 
  return (
    <>
    {
      props?.redirect_link ?  <a href={props?.redirect_link} className={props.class} target='blank'>{props.title}</a>
      :
      <button type='button' className={props.class}>{props.title}</button>
    }
    </> 
  )
}

export default ValButton