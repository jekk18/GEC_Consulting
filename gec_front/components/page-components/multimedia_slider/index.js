import Multimedia from '@/components/Multimedia/Multimedia'
import React from 'react'

const index = (props) => {
  return (
    <Multimedia data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index