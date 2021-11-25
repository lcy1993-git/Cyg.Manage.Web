import { Tabs } from 'antd'
import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react'
import CableWell from '../cable-well'
import CableChannel from '../cable-channel'

const { TabPane } = Tabs

interface CableDesignParams {
  libId: string
}
const CableDesignTab = (props: CableDesignParams, ref: Ref<any>) => {
  const { libId } = props
  const cableWellRefresh = useRef()
  const channelRefresh = useRef()

  const refresh = () => {
    if (cableWellRefresh && cableWellRefresh.current) {
      //@ts-ignore
      cableWellRefresh.current.refresh()
    }

    if (channelRefresh && channelRefresh.current) {
      //@ts-ignore
      channelRefresh.current.refresh()
    }
  }

  useImperativeHandle(ref, () => ({
    refresh,
  }))

  return (
    <Tabs className="normalTabs noMargin">
      <TabPane key="well" tab="电缆井">
        <CableWell ref={cableWellRefresh} libId={libId} />
      </TabPane>
      <TabPane key="channel" tab="电缆通道">
        <CableChannel ref={channelRefresh} libId={libId} />
      </TabPane>
    </Tabs>
  )
}

export default forwardRef(CableDesignTab)
