import React, { useContext } from 'react'
import { IndexContext } from '../../context'
import DeliveyManage from '../delivery-manage'

interface IndexToDoComponentProps {
  componentProps?: string[]
}

const IndexDeliveryComponent: React.FC<IndexToDoComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext)

  return (
    <>
      <DeliveyManage currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default IndexDeliveryComponent
