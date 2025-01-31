import React, { useEffect, useState } from "react";

const ServiceSelectItem = (props) => {
  const [checkActive, setCheckActive] = useState(false);

  const handleCheck = (e) => {
    setCheckActive(!checkActive);
    props.check(e, !checkActive);
  }; 

useEffect(()=> {
    setCheckActive(props.idInArray)
},[props.idInArray]) 

  return (
    <li onClick={handleCheck} title={props.title} id={props.id}>
      <div className={`checked-box ${checkActive  ? 'checked-box checked-box-active' : 'checked-box' }`} >
        <span>
          <svg
            width="17"
            height="13"
            viewBox="0 0 17 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.19244 10.1924L1.69244 6.69244C1.60092 6.5998 1.49192 6.52625 1.37176 6.47605C1.25159 6.42585 1.12266 6.4 0.99244 6.4C0.862215 6.4 0.733284 6.42585 0.613124 6.47605C0.492963 6.52625 0.383962 6.5998 0.292439 6.69244C0.1998 6.78396 0.126248 6.89296 0.0760486 7.01312C0.025849 7.13328 0 7.26221 0 7.39244C0 7.52266 0.025849 7.65159 0.0760486 7.77175C0.126248 7.89191 0.1998 8.00092 0.292439 8.09244L4.48244 12.2824C4.87244 12.6724 5.50244 12.6724 5.89244 12.2824L16.4924 1.69244C16.5851 1.60092 16.6586 1.49192 16.7088 1.37175C16.759 1.25159 16.7849 1.12266 16.7849 0.992439C16.7849 0.862214 16.759 0.733284 16.7088 0.613124C16.6586 0.492963 16.5851 0.383962 16.4924 0.292439C16.4009 0.1998 16.2919 0.126248 16.1718 0.0760484C16.0516 0.0258488 15.9227 0 15.7924 0C15.6622 0 15.5333 0.0258488 15.4131 0.0760484C15.293 0.126248 15.184 0.1998 15.0924 0.292439L5.19244 10.1924Z"
              fill="#049878"
            />
          </svg>
        </span>
      </div>
      <h3>{props.title}</h3>
    </li>
  );
};

export default ServiceSelectItem;
