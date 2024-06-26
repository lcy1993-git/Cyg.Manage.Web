import GeneralTable from '@/components/general-table'
import { getStationSchemeIntervalData } from '@/services/station-house'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Table, Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

const { TabPane } = Tabs

interface StandingBookProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  schemeName: string
  code: string
}

const StationDetail: React.FC<StandingBookProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  const { code, schemeName } = props

  // 动态列
  const [dynamicCol, setDynamicCol] = useState<any[]>([])

  const intervalRef = useRef<HTMLDivElement>(null)
  const limitRef = useRef<HTMLDivElement>(null)
  const drawRef = useRef<HTMLDivElement>(null)

  // 方案间隔
  const intervalFixedCol = [
    {
      title: '编号',
      dataIndex: 'code',
      index: 'code',
      width: 130,
      fixed: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 180,
      fixed: true,
    },

    {
      title: '段落序号',
      dataIndex: 'paraNo',
      index: 'paraNo',
      width: 120,
    },
    {
      title: '类别',
      dataIndex: 'categoryText',
      index: 'categoryText',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'desc',
      index: 'desc',
      width: 150,
    },
  ]

  // 获取并处理间隔数据动态列和数据
  const { data, run, loading } = useRequest(() => getStationSchemeIntervalData(code), {
    manual: true,
    onSuccess: () => {
      const { intervalItems, stationSchemeProperties } = data
      const handleCol = stationSchemeProperties.map((item: any) => {
        return {
          title: item.name,
          dataIndex: item.code,
          index: item.code,
          width: 150,
        }
      })
      intervalFixedCol.splice(4, 0, ...handleCol)
      setDynamicCol(intervalFixedCol)

      intervalItems.forEach((item: any) => {
        return {
          ...item,
          ...stationSchemeProperties.map((ite: any) => {
            const findVal = item.properties.find((ele: any) => ele.schemePropertyCode === ite.code)
            item[ite.code] = findVal.value
          }),
        }
      })
    },
  })

  // 因为间隔数据是动态列 请求特殊处理
  useEffect(() => {
    run()
  }, [code])

  // 方案间隔限制
  const limitColumns = [
    {
      title: '模块类别',
      dataIndex: 'moduleCategoryText',
      index: 'moduleCategoryText',
      width: 150,
    },
    {
      title: '线路类别',
      dataIndex: 'lineCategoryText',
      index: 'lineCategoryText',
      width: 150,
    },
    {
      title: '最小值',
      dataIndex: 'minValue',
      index: 'minValue',
      width: 150,
    },
    {
      title: '最大值',
      dataIndex: 'maxValue',
      index: 'maxValue',
      width: 150,
    },
    {
      title: '是否可用',
      dataIndex: 'usable',
      index: 'usable',
      width: 150,
      render: (text: any, record: any) => {
        return <span>{record.usable ? '是' : '否'}</span>
      },
    },
  ]

  // 方案图纸
  const drawColumns = [
    {
      title: '方案编码',
      dataIndex: 'schemeCode',
      index: 'schemeCode',
      width: 160,
    },
    {
      title: '图纸名称',
      dataIndex: 'name',
      index: 'name',
      width: 120,
    },
  ]

  // const search = () => {
  //   if (currentTab === 'subStations') {
  //     if (subStationRef && subStationRef.current) {
  //       // @ts-ignore
  //       subStationRef.current.search()
  //     }
  //     return
  //   }
  //   if (currentTab === 'mainLine') {
  //     if (mainLineRef && mainLineRef.current) {
  //       // @ts-ignore
  //       mainLineRef.current.search()
  //     }
  //     return
  //   }

  //   if (powerRef && powerRef.current) {
  //     // @ts-ignore
  //     powerRef.current.search()
  //   }
  // }

  // const searchComponent = () => {
  //   return (
  //     <div>
  //       {currentTab === 'subStations' ? (
  //         <TableSearch width="248px">
  //           <Search
  //             value={subStationKeyWord}
  //             onChange={(e: any) => setSubStationKeyWord(e.target.value)}
  //             onSearch={() => search()}
  //             enterButton
  //             placeholder="请输入间隔"
  //           />
  //         </TableSearch>
  //       ) : currentTab === 'power' ? (
  //         <TableSearch width="248px">
  //           <Search
  //             value={powerKeyWord}
  //             onChange={(e: any) => setPowerKeyWord(e.target.value)}
  //             onSearch={() => search()}
  //             enterButton
  //             placeholder="请输入间隔限制"
  //           />
  //         </TableSearch>
  //       ) : (
  //         <TableSearch width="248px">
  //           <Search
  //             value={lineKeyWord}
  //             onChange={(e: any) => setLineKeyWord(e.target.value)}
  //             onSearch={() => search()}
  //             enterButton
  //             placeholder="请输入图纸名称"
  //           />
  //         </TableSearch>
  //       )}
  //     </div>
  //   )
  // }

  // 方案模态框名称获取
  const handleSchemeName = () => {
    return `方案-${schemeName}`
  }

  return (
    <>
      <Modal
        maskClosable={false}
        bodyStyle={{ padding: '24px 24px 0' }}
        title={handleSchemeName()}
        width="90%"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        footer=""
        cancelText="取消"
        onCancel={() => {
          setState(false)
        }}
      >
        <Tabs tabPosition="bottom">
          <TabPane tab="方案间隔" key="interval">
            <Table
              loading={loading}
              bordered
              ref={intervalRef}
              style={{ height: '600px' }}
              scroll={{ y: 515 }}
              pagination={false}
              columns={dynamicCol}
              dataSource={data?.intervalItems}
            />
            {/* <GeneralTable
              ref={intervalRef}
              style={{ height: '400px' }}
              // buttonLeftContentSlot={searchComponent}
              columns={intervalColumns}
              url="/StationScheme/GetStationSchemeIntervalData"
              tableTitle="方案间隔"
              getSelectData={(data) => setTableSelectRows(data)}
              requestSource="resource"
              noPaging
              requestType="get"
              extractParams={{
                stationSchemeCode: code,
              }}
            /> */}
          </TabPane>
          <TabPane tab="间隔限制" key="limit">
            <GeneralTable
              ref={limitRef}
              style={{ height: '600px' }}
              tableHeight="calc(100% - 70px)"
              // buttonLeftContentSlot={searchComponent}
              columns={limitColumns}
              url="/StationScheme/GetStationSchemeIntervalLimits"
              tableTitle="间隔限制"
              requestSource="resource"
              noPaging
              notShowSelect
              requestType="get"
              extractParams={{
                stationSchemeCode: code,
              }}
            />
          </TabPane>
          <TabPane tab="方案图纸" key="draw">
            <GeneralTable
              ref={drawRef}
              style={{ height: '600px' }}
              tableHeight="calc(100% - 70px)"
              // buttonLeftContentSlot={searchComponent}
              columns={drawColumns}
              url="/StationScheme/QueryStationSchemeCharts"
              tableTitle="方案图纸"
              noPaging
              notShowSelect
              requestSource="resource"
              requestType="get"
              extractParams={{
                stationSchemeCode: code,
              }}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  )
}

export default StationDetail
