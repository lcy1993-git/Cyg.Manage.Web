import PageCommonWrap from '@/components/page-common-wrap'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import MapContainerShell from '../components/map-container-shell'
import { Provider, useContainer } from './mobx-store'
import styles from './index.less'
import { SwapOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import SijiMapContainerBox from './siji-map/components/map-container-shell'

const VisualizationResults: React.FC = observer(() => {
  const store = useContainer()
  const [sijiFlag, setSijiFlag] = useState<boolean>(true)
  useEffect(() => {
    return () => {
      store.clear()
    }
  }, [])

  return (
    <PageCommonWrap noPadding={true} className={styles.resultPage}>
      {/* <Filterbar /> */}
      <Tooltip title="切换地图" placement="left">
        <SwapOutlined
          className={styles.changeMap}
          onClick={() => {
            setSijiFlag(!sijiFlag)
          }}
        />
      </Tooltip>

      {sijiFlag ? <SijiMapContainerBox /> : <MapContainerShell />}
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
