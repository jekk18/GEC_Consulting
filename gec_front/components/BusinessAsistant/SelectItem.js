import { useState } from "react"


const SelectItem = (props) => {
  const [checkActive, setCheckActive] = useState(false);

  const handleCheck = (e) => { 
    setCheckActive(!checkActive);
    props.check(e,!checkActive);
  }
  return (
    <div className={`select-item ${checkActive  ? 'check-active' : '' }`} onClick={handleCheck} title={props.itemTitle} id={props.itemId}>{props.itemTitle}</div>
  )
}

export default SelectItem