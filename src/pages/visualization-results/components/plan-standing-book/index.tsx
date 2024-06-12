import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import {
  deleteLine,
  deletePowerSupply,
  deleteTransformerSubstation,
  modifyLine,
  modifyPowerSupply,
  modifyTransformerSubstation,
} from '@/services/grid-manage/treeMenu'
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useControllableValue, useUpdateEffect } from 'ahooks'
import { Button, Form, Input, message, Modal, Tabs } from 'antd'
import { isArray } from 'lodash'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import {
  COLORU,
  KVLEVELOPTIONS,
  POWERSUPPLY,
  TRANSFORMERSUBSTATION,
} from '../../grid-manage/DrawToolbar/GridUtils'
import { upateLineByMainLine } from '../../grid-manage/GridMap/utils/initializeMap'
import { deletFeatureByTable, editFeature } from '../../grid-manage/GridMap/utils/select'
import {
  transformAreaDataToArr,
  transformAreaDataToString,
  transformArrtToAreaData,
} from '../../grid-manage/tools'
import { useMyContext } from '../../plan-manage/Context'
import { handleGeom } from '../../utils/methods'
import SubStationPowerForm from './components/subStation-power-form'

const { TabPane } = Tabs

interface StandingBookProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}

const tabTitle = {
  subStations: '变电站',
  power: '电源',
  mainLine: '主线路',
}

const { Search } = Input

const kvOptions = { 3: '10kV', 4: '20kV', 5: '35kV', 6: '110kV', 7: '330kV' }

const PlanStandingBook: React.FC<StandingBookProps> = (props) => {
  const { companyId, setIsRefresh, isRefresh, checkLineIds, mapRef, areaMap } = useMyContext()
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [subStationKeyWord, setSubStationKeyWord] = useState<string>('')
  const [powerKeyWord, setPowerKeyWord] = useState<string>('')
  const [lineKeyWord, setLineKeyWord] = useState<string>('')

  //出线间隔数据
  const [intervalData, setIntervalData] = useState<any[]>([])

  const subStationRef = useRef<HTMLDivElement>(null)
  const powerRef = useRef<HTMLDivElement>(null)
  const mainLineRef = useRef<HTMLDivElement>(null)

  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [powerSelectRows, setPowerSelectRows] = useState<any[]>([])
  const [mainLineRows, setMainLineRows] = useState<any[]>([])

  //当前Tab
  const [currentTab, setCurrentTab] = useState<string>('subStations')

  const [formVisible, setFormVisible] = useState<boolean>(false)

  const [subForm] = Form.useForm()
  const [powerForm] = Form.useForm()
  const [lineForm] = Form.useForm()

  //变电站Id
  const [selectTransId, setSelectTransId] = useState<string>('0')

  // const { data, run } = useRequest(getAuthorizationDetail, {
  //   manual: true,
  // })

  const subStationColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 200,
      render: (text: any, record: any) => {
        return companyId !== record.companyId ? (
          <>
            <InfoCircleOutlined style={{ color: '#2d7de3' }} title="子公司项目" />
            <span style={{ paddingLeft: '3px' }}> {record.name}</span>
          </>
        ) : (
          record.name
        )
      },
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      width: 150,
      render: (text: any, record: any) => {
        return kvOptions[record.kvLevel]
      },
    },
    {
      title: '设计规模',
      dataIndex: 'designScaleMainTransformer',
      index: 'designScaleMainTransformer',
      width: 150,
    },
    {
      title: '已建规模',
      dataIndex: 'builtScaleMainTransformer',
      index: 'builtScaleMainTransformer',
      width: 150,
    },
    {
      title: '主接线方式',
      dataIndex: 'mainWiringMode',
      index: 'mainWiringMode',
      width: 150,
    },
    {
      title: '经纬度',
      dataIndex: 'geom',
      index: 'geom',
      width: 240,
      render: (text: any, record: any) => {
        return record.geom.slice(6).replace(' ', ' ，')
      },
    },
    {
      title: '区域',
      dataIndex: 'area',
      index: 'area',
      width: 150,
      render: (text: any, record: any) => {
        return transformAreaDataToString(record)
      },
    },
  ]

  const powerColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 200,
      render: (text: any, record: any) => {
        return companyId !== record.companyId ? (
          <>
            <InfoCircleOutlined style={{ color: '#2d7de3' }} title="子公司项目" />
            <span style={{ paddingLeft: '3px' }}> {record.name}</span>
          </>
        ) : (
          record.name
        )
      },
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      width: 150,
      render: (text: any, record: any) => {
        return kvOptions[record.kvLevel]
      },
    },
    {
      title: '电源类型',
      dataIndex: 'powerType',
      index: 'powerType',
      width: 150,
    },
    {
      title: '装机容量',
      dataIndex: 'installedCapacity',
      index: 'installedCapacity',
      width: 150,
    },
    {
      title: '调度方式',
      dataIndex: 'schedulingMode',
      index: 'schedulingMode',
      width: 150,
    },
    {
      title: '经纬度',
      dataIndex: 'geom',
      index: 'geom',
      width: 240,
      render: (text: any, record: any) => {
        return record.geom.slice(6).replace(' ', ' ，')
      },
    },
    {
      title: '区域',
      dataIndex: 'area',
      index: 'area',
      width: 150,
      render: (text: any, record: any) => {
        return transformAreaDataToString(record)
      },
    },
  ]

  const lineColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 220,
      render: (text: any, record: any) => {
        return companyId !== record.companyId ? (
          <>
            <InfoCircleOutlined style={{ color: '#2d7de3' }} title="子公司项目" />
            <span style={{ paddingLeft: '3px' }}> {record.name}</span>
          </>
        ) : (
          record.name
        )
      },
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      width: 100,
      render: (text: any, record: any) => {
        return kvOptions[record.kvLevel]
      },
    },
    {
      title: '所属厂站',
      dataIndex: 'belongingName',
      index: 'belongingName',
      width: 160,
    },
    {
      title: '配变总容量',
      dataIndex: 'totalCapacity',
      index: 'totalCapacity',
      width: 120,
    },
    {
      title: '线路总长度',
      dataIndex: 'totalLength',
      index: 'totalLength',
      width: 120,
    },
    {
      title: '线路类型',
      dataIndex: 'isOverhead',
      index: 'isOverhead',
      width: 140,
      render: (text: any, record: any) => {
        return record.isOverhead ? '架空线路' : '电缆线路'
      },
    },

    {
      title: '线路型号',
      dataIndex: 'conductorModel',
      index: 'conductorModel',
      width: 160,
    },
    {
      title: '线路性质',
      dataIndex: 'lineProperties',
      index: 'lineProperties',
      width: 120,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      index: 'color',
      width: 80,
    },
    // {
    //   title: '经纬度',
    //   dataIndex: 'geom',
    //   index: 'geom',
    //   width: 240,
    //   render: (text: any, record: any) => {
    //     return record.geom.slice(6).replace(' ', ' ，')
    //   },
    // },
  ]

  const refresh = () => {
    if (currentTab === 'subStations') {
      if (subStationRef && subStationRef.current) {
        // @ts-ignore
        subStationRef.current.search()
      }
      return
    }

    if (currentTab === 'mainLine') {
      if (mainLineRef && mainLineRef.current) {
        // @ts-ignore
        mainLineRef.current.search()
      }
      return
    }

    //
    if (powerRef && powerRef.current) {
      // @ts-ignore
      powerRef.current.search()
    }
  }

  const deleteEvent = async () => {
    if (currentTab === 'subStations') {
      const deleteIds: string[] = await deleteTransformerSubstation([tableSelectRows[0].id])
      deletFeatureByTable(
        mapRef.map,
        {
          ...tableSelectRows[0],
          featureType: TRANSFORMERSUBSTATION,
        },
        deleteIds
      )
      message.success('删除成功')
      refresh()
      setIsRefresh(!isRefresh)
      return
    }
    if (currentTab === 'power') {
      const deleteIds: string[] = await deletePowerSupply([powerSelectRows[0].id])
      deletFeatureByTable(
        mapRef.map,
        {
          ...powerSelectRows[0],
          featureType: POWERSUPPLY,
        },
        deleteIds
      )
      message.success('删除成功')
      refresh()
      setIsRefresh(!isRefresh)
      return
    }
    // 删除线路、刷新左侧树勾选的线路

    await deleteLine([mainLineRows[0].id])
    deletFeatureByTable(mapRef.map, null, [mainLineRows[0].id])
    message.success('删除成功')
    refresh()
    setIsRefresh(!isRefresh)
    return
  }

  const editEvent = async () => {
    if (currentTab === 'subStations') {
      if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }

      const editData = tableSelectRows[0]
      if (editData.companyId !== companyId) {
        message.error('无法操作子公司项目')
        return
      }
      setSelectTransId(editData.id)
      setIntervalData(editData.transformerInterval)
      const geom = handleGeom(editData.geom)
      const { province, city, area } = editData
      const areas = []
      !!province && areas.push(province)
      !!city && areas.push(city)
      !!area && areas.push(area)

      subForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
        areas,
      })
      setFormVisible(true)
      return
    }
    if (currentTab === 'power') {
      if (powerSelectRows && isArray(powerSelectRows) && powerSelectRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = powerSelectRows[0]

      const geom = handleGeom(editData.geom)
      powerForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
        areas: transformAreaDataToArr(editData),
      })
      setFormVisible(true)
      return
    }
    //主线路
    if (mainLineRows && isArray(mainLineRows) && mainLineRows.length === 0) {
      message.warning('请选择一条数据进行编辑')
      return
    }
    const editData = mainLineRows[0]
    lineForm.setFieldsValue({
      ...editData,
      lineType: editData.isOverhead ? 'Line' : 'CableCircuit',
    })
    setFormVisible(true)
  }
  // 当前选中的主线线路
  const currentChecklineIds = () => {
    const ids = [...new Set(checkLineIds)]
    const lineIds: string[] = ids
      .map((item: string) => {
        const exist = item.includes('_&Line')
        if (exist) {
          return item.split('_&Line')[0]
        }
        return ''
      })
      .filter((item: string) => item)
    return lineIds
  }

  const sureEditEvent = () => {
    if (currentTab === 'subStations') {
      const editData = tableSelectRows[0]

      subForm.validateFields().then(async (values) => {
        // 判断当前的电压等级
        let color = ''
        if (values.kvLevel !== '3') {
          // 不为10kV
          const exist = KVLEVELOPTIONS.find((item) => item.kvLevel === Number(values.kvLevel))
          color = exist?.color[0].label || ''
        }

        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          transformerInterval: intervalData,
          color,
          ...transformArrtToAreaData(values.areas, areaMap),
          gridDataType: 1,
        }
        await modifyTransformerSubstation(submitInfo)

        const currentLinesColor = COLORU.find((item) => item.label === submitInfo.color)
        const drawParams = {
          ...submitInfo,
          color: currentLinesColor?.value,
          featureType: TRANSFORMERSUBSTATION,
        }

        editFeature(mapRef.map, drawParams)

        subForm.resetFields()
        refresh()
        setIsRefresh(!isRefresh)
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    //电源
    if (currentTab === 'power') {
      const editData = powerSelectRows[0]
      powerForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: '咖啡',
          ...transformArrtToAreaData(values.areas, areaMap),
          gridDataType: 1,
        }
        await modifyPowerSupply(submitInfo)
        const drawParams = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: '#4D3900',
          featureType: POWERSUPPLY,
          gridDataType: 1,
        }
        editFeature(mapRef.map, drawParams)
        powerForm.resetFields()
        refresh()
        setIsRefresh(!isRefresh)
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }

    //主线路
    const editData = mainLineRows[0]
    lineForm.validateFields().then(async (values) => {
      // 判断当前的电压等级
      let color = ''
      if (values.kvLevel !== '3') {
        // 不为10kV
        const exist = KVLEVELOPTIONS.find((item) => item.kvLevel === Number(values.kvLevel))
        color = exist?.color[0].label || ''
      }
      // 上传服务器参数
      const submitInfo = {
        id: editData.id,
        ...values,
        isOverhead: values.lineType === 'Line' ? true : false,
        color: values.color ? values.color : color,
        gridDataType: 1,
      }

      await modifyLine(submitInfo)
      // 更新地图数据参数
      const lineIds = currentChecklineIds()
      const exist = lineIds.some((item) => item === submitInfo.id)
      if (exist) {
        const currentLinesColor = COLORU.find((item) => item.label === submitInfo.color)
        const drawParams = {
          ...submitInfo,
          color: currentLinesColor ? currentLinesColor.value : '',
          gridDataType: 1,
        }
        upateLineByMainLine(mapRef.map, drawParams)
      }

      lineForm.resetFields()
      refresh()
      setIsRefresh(!isRefresh)
      message.success('更新成功')
      setFormVisible(false)
    })
  }

  //操作权限判断
  const canEdit = () => {
    if (
      (tableSelectRows[0] && tableSelectRows[0].companyId !== companyId) ||
      (powerSelectRows[0] && powerSelectRows[0].companyId !== companyId) ||
      (mainLineRows[0] && mainLineRows[0].companyId !== companyId)
    ) {
      return true
    }
    return false
  }

  const getCurrentRow = (currentTab: string) => {
    switch (currentTab) {
      case 'subStations':
        return tableSelectRows
      case 'power':
        return powerSelectRows
      case 'mainLine  ':
        return mainLineRows
      default:
        return
    }
  }

  const tableButton = () => {
    return (
      <div>
        {/* {buttonJurisdictionArray?.includes('edit-structure-company') && ( */}
        <Button className="mr7" onClick={() => editEvent()} disabled={canEdit()}>
          <EditOutlined />
          编辑
        </Button>
        {/* )} */}
        {/* {buttonJurisdictionArray?.includes('delete-structure-company') && ( */}
        <ModalConfirm
          disabled={canEdit()}
          changeEvent={deleteEvent}
          selectData={getCurrentRow(currentTab)}
          // contentSlot={deleteContent}
        />
        {/* )} */}
      </div>
    )
  }

  const search = () => {
    if (currentTab === 'subStations') {
      if (subStationRef && subStationRef.current) {
        // @ts-ignore
        subStationRef.current.search()
      }
      return
    }
    if (currentTab === 'mainLine') {
      if (mainLineRef && mainLineRef.current) {
        // @ts-ignore
        mainLineRef.current.search()
      }
      return
    }

    if (powerRef && powerRef.current) {
      // @ts-ignore
      powerRef.current.search()
    }
  }

  const searchComponent = () => {
    return (
      <div>
        {currentTab === 'subStations' ? (
          <TableSearch width="248px">
            <Search
              value={subStationKeyWord}
              onChange={(e: any) => setSubStationKeyWord(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入变电站名称"
            />
          </TableSearch>
        ) : currentTab === 'power' ? (
          <TableSearch width="248px">
            <Search
              value={powerKeyWord}
              onChange={(e: any) => setPowerKeyWord(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入电源名称"
            />
          </TableSearch>
        ) : (
          <TableSearch width="248px">
            <Search
              value={lineKeyWord}
              onChange={(e: any) => setLineKeyWord(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入主线路名称"
            />
          </TableSearch>
        )}
      </div>
    )
  }

  useUpdateEffect(() => {
    if (!state) {
      setTableSelectRows([])
      setPowerSelectRows([])
      setMainLineRows([])
      setCurrentTab('subStations')
    }
  }, [state])

  return (
    <>
      <Modal
        maskClosable={false}
        bodyStyle={{ padding: '24px 24px 0' }}
        title="网架台账"
        width="70%"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        footer=""
        cancelText="取消"
        onCancel={() => {
          setState(false)
        }}
      >
        <Tabs tabPosition="bottom" onChange={(value: string) => setCurrentTab(value)}>
          <TabPane tab="变电站" key="subStations">
            <GeneralTable
              ref={subStationRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={subStationColumns}
              url="/TransformerSubstation/GetPagedList"
              tableTitle="变电站"
              getSelectData={(data) => setTableSelectRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: subStationKeyWord,
                gridDataType: 1,
              }}
            />
          </TabPane>
          <TabPane tab="电源" key="power">
            <GeneralTable
              ref={powerRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={powerColumns}
              url="/PowerSupply/GetPagedList"
              tableTitle="电源"
              getSelectData={(data) => setPowerSelectRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: powerKeyWord,
                gridDataType: 1,
              }}
            />
          </TabPane>
          <TabPane tab="主线路" key="mainLine">
            <GeneralTable
              ref={mainLineRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={lineColumns}
              url="/Line/GetPagedList"
              tableTitle="主线路"
              getSelectData={(data) => setMainLineRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: lineKeyWord,
                gridDataType: 1,
              }}
            />
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        maskClosable={false}
        bodyStyle={{ padding: '24px 24px 0' }}
        title={`编辑${tabTitle[currentTab]}信息`}
        width="650px"
        visible={formVisible}
        destroyOnClose
        okText="保存"
        cancelText="取消"
        onCancel={() => setFormVisible(false)}
        onOk={() => sureEditEvent()}
      >
        <Form
          form={
            currentTab === 'subStations' ? subForm : currentTab === 'power' ? powerForm : lineForm
          }
        >
          {/* 只有主线路表单需要做特殊处理所以只传lineForm */}
          <SubStationPowerForm
            currentEditTab={currentTab}
            form={lineForm}
            transId={selectTransId}
            intervalData={intervalData}
            dataOnchange={setIntervalData}
          />
        </Form>
      </Modal>
    </>
  )
}

export default PlanStandingBook
