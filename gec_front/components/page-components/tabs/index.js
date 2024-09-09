import TabComponent from '@/components/TabsComponent/TabComponent'
import React from 'react'

const index = (props) => { 
  return (
    <TabComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index