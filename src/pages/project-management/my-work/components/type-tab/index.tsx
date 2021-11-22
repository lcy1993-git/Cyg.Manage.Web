import React, { useMemo } from 'react'
import { useMyWorkStore } from '../../context'
import styles from './index.less'

interface TypeTabProps {
  typeArray: any[]
}

const TypeTab: React.FC<TypeTabProps> = (props) => {
  const { currentClickTabChildActiveType, setCurrentClickTabChildActiveType } = useMyWorkStore()
  const { typeArray } = props

  const typeTabElement = useMemo(() => {
    return typeArray.map((item) => {
      const isActive = item.id === currentClickTabChildActiveType ? styles.active : ''
      return (
        <div
          className={`${styles.typeSingleTab} ${isActive}`}
          key={item.id}
          onClick={() => {
            setCurrentClickTabChildActiveType(item.id)
          }}
        >
          {item.label}
        </div>
      )
    })
  }, [typeArray, currentClickTabChildActiveType])

  return <div className={styles.typeTab}>{typeTabElement}</div>
}

export default TypeTab
