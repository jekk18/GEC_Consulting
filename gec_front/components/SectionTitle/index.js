 
const SectionTitle = (props) => {
  return (
    <h1 className={`h1__section-title ${props.class}`}> 
        <span className="title__0" style={{color: `${props.titleColor}`}}>
            {props.title}  
        </span>
    </h1>
  )
}

export default SectionTitle