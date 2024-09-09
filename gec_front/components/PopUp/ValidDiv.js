import React from 'react'

const ValidDiv = (props) => {
  return (
    <div className={`${props.class} valid-input-box`}>
        {props.children}
    </div>
  )
}

export default ValidDiv