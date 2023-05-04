import PageCommonWrap from '@/components/page-common-wrap'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import MapContainerShell from '../components/map-container-shell'
import { Provider, useContainer } from './mobx-store'
import styles from './index.less'
import { SwapOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

const VisualizationResults: React.FC = observer(() => {
  const store = useContainer()
  const useSjMap = localStorage.getItem('useSjMap')

  useEffect(() => {
    return () => {
      store.clear()
    }
  })

  return (
    <PageCommonWrap noPadding={true} className={styles.resultPage}>
      {/* <Filterbar /> */}
      {Number(useSjMap) === 1 && (
        <Tooltip title="切换地图" placement="left">
          <SwapOutlined
            className={styles.changeMap}
            onClick={() => {
              // setSijiFlag(!sijiFlag)
              store.setIsSj()
            }}
          />
        </Tooltip>
      )}

      <MapContainerShell />
    </PageCommonWrap>
  )
})

const StoreProvider: React.FC = () => {
  return (
    <Provider>
      <VisualizationResults />
    </Provider>
  )
}

export default StoreProvider
