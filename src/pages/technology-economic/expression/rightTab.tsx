import { getExpressionTemplateSheetMenuList } from '@/services/technology-economic/expression'
import { Tabs } from 'antd'
import { observer } from 'mobx-react-lite'
import React from 'react'
import Card from './card'
import styles from './index.less'
import { useExpressionContainer } from './store'
const { TabPane } = Tabs
const RightTab = observer(() => {
  const store = useExpressionContainer()
  const { rightTabId, rightTabList, allList } = store.state

  // 切换tab
  const callback = async (key: any) => {
    store.setRightTabId(key)
    const result = await getExpressionTemplateSheetMenuList(key)
    const newList: any[] = result as []
    newList && newList.length > 0 && store.setRightTile(newList)
  }
  return (
    <div className={styles.containerRight}>
      {rightTabList && rightTabList.length > 0 && rightTabId ? (
        <Tabs onChange={callback} type="card">
          {rightTabList.map((item: any, index: number) => {
            return (
              <TabPane
                tab={item.expressionTemplateSheetName}
                key={item.id}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#EAEAEA',
                  padding: '20px',
                }}
              >
                <div className={styles.allCardDiv}>
                  {allList.map((r: any, i: number) => {
                    return (
                      <div className={styles.cardDiv}>
                        <Card data={r.data} index={index} cInd={i} hIndex={r.hIndex} />
                      </div>
                    )
                  })}
                </div>
              </TabPane>
            )
          })}
        </Tabs>
      ) : (
        <div></div>
      )}
    </div>
  )
})
export default RightTab
