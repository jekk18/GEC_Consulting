import Testimonial from '@/components/Testimonial/Testimonial'
import React from 'react'

const index = (props) => {
  return (
    <Testimonial data={props.componentData}  page={props.page} isPost={props.isPost} /> 
  )
}

export default index