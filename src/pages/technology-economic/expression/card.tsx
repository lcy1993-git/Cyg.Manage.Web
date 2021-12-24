import { CaretRightOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import React from 'react'
import styles from './index.less'
import { useExpressionContainer } from './store'
const Card = observer((props: { data: any[]; index: number; cInd: number; hIndex: string }) => {
  // cInd:卡片index
  // hIndex:选中index
  const { data, index, cInd, hIndex } = props
  const store = useExpressionContainer()
  //   const { currentRow } = store.state

  const selectRow = (e: any, cInd: number, hIndex: number) => {
    store.setCurrentRow(e, cInd, hIndex)
  }
  const cancelSelectRow = (e: any, cInd: number, hIndex: number) => {
    store.setCancelSelectRow(e, cInd, hIndex)
  }

  return (
    <div className={styles.card}>
      {data.map((res: any, i: number) => {
        let index = 0
        const newIndex = parseInt(hIndex)
        if (newIndex) {
          index = newIndex - 1 > 0 ? newIndex - 1 : 0
        }
        // i:选项index
        if (res.childs && res.childs.length > 0) {
          return res.selected ? (
            <div
              style={{ width: '100%', position: 'relative' }}
              onClick={() => cancelSelectRow(res, cInd, i)}
            >
              <div className={styles.selectCardItem}>
                <div className={styles.selctCardName}>{res.menuName}</div>
                <div className={styles.rightDiv}>
                  <CaretRightOutlined />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={newIndex && index === i ? styles.otherCardItem : styles.cardItem}
              onClick={() => selectRow(res, cInd, i)}
            >
              <div className={styles.cardName}>{res.menuName}</div>
              <div className={styles.rightDiv}>
                <CaretRightOutlined />
              </div>
            </div>
          )
        } else {
          return (
            <div className={newIndex && index === i ? styles.otherCardItemTwo : styles.cardItemTwo}>
              <div className={styles.cardName}>{res.menuName}</div>
              {res.formula && !hIndex && (
                <div className={styles.formula} style={{ flex: '2' }}>
                  <div className={styles.formulaContent}>{res.formula}</div>
                </div>
              )}
              {res.formulaName && !hIndex && (
                <div className={styles.formula}>
                  <div className={styles.formulaContent}>{res.formulaName}</div>
                </div>
              )}
              {/* {res.formula && (
                <div className={styles.formula} style={{ flex: '2' }}>
                  <div className={styles.formulaContent}>{res.formula}</div>
                </div>
              )}
              {res.formulaName && (
                <div className={styles.formula} style={{ paddingLeft: '10px' }}>
                  <div className={styles.formulaContent}>{res.formulaName}</div>
                </div>
              )} */}
            </div>
          )
        }
      })}
    </div>
  )
})
export default Card
