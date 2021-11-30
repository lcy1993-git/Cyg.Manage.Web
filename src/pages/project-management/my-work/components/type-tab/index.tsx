import React, { useMemo } from 'react'
import { useMyWorkStore } from '../../context'
import styles from './index.less'

interface TypeTabProps {
  typeArray: any[]
}

const TypeTab: React.FC<TypeTabProps> = (props) => {
  const {
    currentClickTabChildActiveType,
    currentClickTabType,
    setCurrentClickTabChildActiveType,
    myWorkInitData,
    setIndexToPageSearchParams,
  } = useMyWorkStore()
  const { typeArray } = props

  const thieTypeClickEvent = (id: string) => {
    setCurrentClickTabChildActiveType(id)
    const requestUrl = myWorkInitData
      .find((item) => item.id === currentClickTabType)
      .children.find((item: any) => item.id === id).url
    setIndexToPageSearchParams({
      requestUrl,
    })
  }

  const typeTabElement = useMemo(() => {
    return typeArray.map((item) => {
      const isActive = item.id === currentClickTabChildActiveType ? styles.active : ''
      return (
        <div
          className={`${styles.typeSingleTab} ${isActive}`}
          key={item.id}
          onClick={() => thieTypeClickEvent(item.id)}
        >
          {`${item.label}(${item.number})`}
        </div>
      )
    })
  }, [typeArray, currentClickTabChildActiveType])

  return <div className={styles.typeTab}>{typeTabElement}</div>
}

export default TypeTab
