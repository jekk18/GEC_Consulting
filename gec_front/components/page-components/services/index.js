import ServicesComponent from '@/components/ServicesComponent/ServicesComponent'
import React from 'react'

const index = (props) => {
  return (
    <ServicesComponent data={props.componentData}  page={props.page} isPost={props.isPost} /> 
  )
}

export default index