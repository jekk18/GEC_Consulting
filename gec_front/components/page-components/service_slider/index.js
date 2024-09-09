import ServicesSection from '@/components/ServicesSection/servicesSection'
import React from 'react'

const index = (props) => {
  return (
    <ServicesSection data={props.componentData}  page={props.page} isPost={props.isPost} />  
  )
}

export default index