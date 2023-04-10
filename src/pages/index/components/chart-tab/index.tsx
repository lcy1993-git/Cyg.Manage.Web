import React, { useState, useEffect } from 'react'

import styles from './index.less'

interface ChartTabDataItem {
  name: string
  id: string
}

interface ChartTabProps {
  data: ChartTabDataItem[]
  onChange?: (selectVakye: string) => void
  defaultValue?: string
}

const ChartTab: React.FC<ChartTabProps> = (props) => {
  const { data, onChange, defaultValue = '' } = props
  const [activeTab, setActiveTab] = useState<string>('')

  const tabItemClickEvent = (id: string) => {
    setActiveTab(id)
    onChange?.(id)
  }

  const tabElement = data.map((item) => {
    const isActive = activeTab === item.id ? styles.active : ''
    return (
      <div
        key={item.id}
        onClick={() => tabItemClickEvent(item.id)}
        className={`${styles.chartTabItem} ${isActive}`}
      >
        {item.name}
      </div>
    )
  })

  useEffect(() => {
    onChange?.(defaultValue)
    setActiveTab(defaultValue)
  }, [defaultValue])

  return <div className={styles.chartTab}>{tabElement}</div>
}

export default ChartTab
