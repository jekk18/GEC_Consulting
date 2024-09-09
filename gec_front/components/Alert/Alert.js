import React from 'react'
import CloseIcon from '../Icons/CloseIcon'
import SuccsessAlert from '../Icons/SuccsessAlert'
import { useState } from 'react'
import ErrorAlert from '../Icons/ErrorAlert'

const Alert = (props) => {
    const handCLose = () => {
        props.click(false)
     }  
    return (  
   <div className="alert-container">
         <div className={`form-alert ${props?.class}`}>
        <div className="alert-content">
            <div className="close-icon-alert" onClick={handCLose}>
                <CloseIcon />
            </div>
            <div className="alert-icon">
                {
                    props?.succsess ? 
                    (
                        <SuccsessAlert />
                    )
                    :
                    (
                        <ErrorAlert />  
                    )
                }
            </div>
            <div className="alert-text">
                {props?.responseText}
            </div>
        </div>
    </div> 
   </div>
    )
  
}

export default Alert