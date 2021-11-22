import CommonTitle from '@/components/common-title'
import React from 'react'
import TypeTab from '../type-tab'
import styles from './index.less'

interface TypeElementProps {
  typeArray: any[]
}

const TypeElement: React.FC<TypeElementProps> = (props) => {
  const { typeArray } = props

  return (
    <div className={styles.typeElement}>
      {typeArray && typeArray.length === 1 && (
        <CommonTitle>
          {typeArray[0].label}({typeArray[0].number})
        </CommonTitle>
      )}
      {typeArray && typeArray.length > 1 && <TypeTab typeArray={typeArray} />}
    </div>
  )
}

export default TypeElement
