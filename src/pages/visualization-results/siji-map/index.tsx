import PageCommonWrap from '@/components/page-common-wrap'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import MapContainerShell from './components/map-container-shell'
import { Provider, useContainer } from './mobx-store'

const VisualizationResults: React.FC = observer(() => {
  const store = useContainer()
  useEffect(() => {
    return () => {
      store.clear()
    }
  }, [])

  return (
    <PageCommonWrap noPadding={true}>
      {/* <Filterbar /> */}
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
