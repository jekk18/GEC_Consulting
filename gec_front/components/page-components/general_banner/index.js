import Banners from '@/components/Banners'
import React from 'react'

const index = (props) => { 

  return (
    <Banners data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index