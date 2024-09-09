import Link from 'next/link'
import React from 'react'

const ReadMore = (props) => {
  return (
    <Link href={props.ReadMoreUrl} className="read-more-link__01"> 
       {props.ReadText}
    </Link>
  )
}

export default ReadMore