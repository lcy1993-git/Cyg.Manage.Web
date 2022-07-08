import { useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import { Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import GeneralTable from '@/components/general-table'
import { EditOutlined } from '@ant-design/icons'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import SubStationPowerForm from './components/subStation-power-form'
import { isArray } from 'lodash'
import {
  deleteLine,
  deletePowerSupply,
  deleteTransformerSubstation,
  modifyLine,
  modifyPowerSupply,
  modifyTransformerSubstation,
} from '@/services/grid-manage/treeMenu'
import { handleGeom } from '../../utils/methods'

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

const StandingBook: React.FC<StandingBookProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [subStationKeyWord, setSubStationKeyWord] = useState<string>('')
  const [powerKeyWord, setPowerKeyWord] = useState<string>('')
  const [lineKeyWord, setLineKeyWord] = useState<string>('')

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
  ]

  const powerColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 200,
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
  ]

  const lineColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 200,
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
      title: '所属厂站',
      dataIndex: 'belonging',
      index: 'belonging',
      width: 150,
    },
    {
      title: '配变总容量',
      dataIndex: 'totalCapacity',
      index: 'totalCapacity',
      width: 150,
    },
    {
      title: '线路总长度',
      dataIndex: 'totalLength',
      index: 'totalLength',
      width: 150,
    },
    {
      title: '线路类型',
      dataIndex: 'isOverhead',
      index: 'isOverhead',
      width: 150,
      render: (text: any, record: any) => {
        return record.isOverhead ? '架空线路' : '电缆线路'
      },
    },
    {
      title: '线路型号',
      dataIndex: 'conductorModel',
      index: 'conductorModel',
      width: 150,
    },
    {
      title: '线路性质',
      dataIndex: 'lineProperties',
      index: 'lineProperties',
      width: 150,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      index: 'color',
      width: 150,
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
      await deleteTransformerSubstation([tableSelectRows[0].id])
      message.success('删除成功')
      refresh()
      return
    }
    if (currentTab === 'power') {
      await deletePowerSupply([powerSelectRows[0].id])
      message.success('删除成功')
      refresh()
      return
    }
    await deleteLine([mainLineRows[0].id])
    message.success('删除成功')
    refresh()
    return
  }

  const editEvent = async () => {
    if (currentTab === 'subStations') {
      if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = tableSelectRows[0]
      setSelectTransId(editData.id)
      const geom = handleGeom(editData.geom)

      subForm.setFieldsValue({
        ...editData,
        kvLevel: String(editData.kvLevel),
        lng: geom[0],
        lat: geom[1],
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
        kvLevel: String(editData.kvLevel),
        lng: geom[0],
        lat: geom[1],
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
      kvLevel: String(editData.kvLevel),
    })
    setFormVisible(true)
  }

  //
  const sureEditEvent = () => {
    if (currentTab === 'subStations') {
      const editData = tableSelectRows[0]

      subForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
        }

        await modifyTransformerSubstation(submitInfo)
        subForm.resetFields()
        refresh()
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
        }
        await modifyPowerSupply(submitInfo)
        powerForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
    }

    //主线路
    const editData = mainLineRows[0]
    lineForm.validateFields().then(async (values) => {
      const submitInfo = {
        id: editData.id,
        ...values,
        isOverhead: values.lineType === 'Line' ? true : false,
      }
      await modifyLine(submitInfo)
      lineForm.resetFields()
      refresh()
      message.success('更新成功')
      setFormVisible(false)
    })
  }

  const tableButton = () => {
    return (
      <div>
        {/* {buttonJurisdictionArray?.includes('edit-structure-company') && ( */}
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        {/* )} */}
        {/* {buttonJurisdictionArray?.includes('delete-structure-company') && ( */}
        <ModalConfirm
          changeEvent={deleteEvent}
          // selectData={[checkRadioValue].filter(Boolean)}
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
        ) : currentTab === 'power ' ? (
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
        onCancel={() => setState(false)}
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
          />
        </Form>
      </Modal>
    </>
  )
}

export default StandingBook
