import React from 'react'
import PartnersComponent from '@/components/PartnersComponent/PartnersComponent'

const index = (props) => {
  return (
    <PartnersComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index