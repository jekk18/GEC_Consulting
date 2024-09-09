import CounterUp from '@/components/CounterUp/CounterUp'
import React from 'react'

const index = (props) => {
  return (
    <CounterUp data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index