import { useControllableValue } from 'ahooks'
import React, { SetStateAction, Dispatch } from 'react'
import styles from './index.less'

interface TabsItem {
  value: string
  name: string
}

interface TabsWindowProps {
  value: string
  tabsArray: TabsItem[]
  titleCustomSlot?: () => React.ReactNode
  onChange: Dispatch<SetStateAction<string>>
}

const TabsWindow: React.FC<TabsWindowProps> = (props) => {
  const { tabsArray, titleCustomSlot } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'value' })

  const tabItemClickEvent = (value: string) => {
    setState(value)
  }

  const tabsElement = tabsArray.map((item) => {
    return (
      <div
        key={item.value}
        className={`${styles.tabsItem} ${item.value === state ? styles.tabsItemActive : ''}`}
        onClick={() => tabItemClickEvent(item.value)}
      >
        {item.name}
      </div>
    )
  })

  return (
    <div className={styles.tabsWindow}>
      <div className={styles.tabsWindowTitle}>
        <div className={styles.tabsWindowTabContent}>{tabsElement}</div>
        <div className={styles.tabsWindowCustomContent}>{titleCustomSlot?.()}</div>
      </div>
      <div className={styles.tabsWindowContent}>{props.children}</div>
    </div>
  )
}

export default TabsWindow
