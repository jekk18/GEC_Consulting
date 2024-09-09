import TeamComponent from '@/components/TeamComponent/TeamComponent'
import React from 'react'

const index = (props) => { 
  return (
    <TeamComponent data={props.componentData}  page={props.page} isPost={props.isPost} /> 
  )
}

export default index