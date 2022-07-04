import { useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal, Popconfirm, RadioChangeEvent } from 'antd'
import { Radio, Space, Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import GeneralTable from '@/components/general-table'
import { EditOutlined } from '@ant-design/icons'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import SubStationPowerForm from './components/subStation-power-form'
import { isArray } from 'lodash'

const { TabPane } = Tabs

interface StandingBookProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}

const tabTitle = {
  subStations: '变电站',
  power: '电源',
}

const { Search } = Input

const kvOptions = { 4: '20kV', 5: '35kV', 6: '110kV', 7: '330kV' }

const StandingBook: React.FC<StandingBookProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [subStationKeyWord, setSubStationKeyWord] = useState<string>('')
  const [powerKeyWord, setPowerKeyWord] = useState<string>('')
  const subStationRef = useRef<HTMLDivElement>(null)
  const powerRef = useRef<HTMLDivElement>(null)

  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [powerSelectRows, setPowerSelectRows] = useState<any[]>([])

  //当前Tab
  const [currentTab, setCurrentTab] = useState<string>('subStations')

  const [formVisible, setFormVisible] = useState<boolean>(false)

  const [subForm] = Form.useForm()
  const [powerForm] = Form.useForm()

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
      title: '来源',
      dataIndex: 'sourceType',
      index: 'sourceType',
      width: 150,
      render: (text: any, record: any) => {
        return record.sourceTypeText
      },
    },
    {
      title: '类别',
      dataIndex: 'category',
      index: 'category',
      width: 150,
      render: (text: any, record: any) => {
        return record.categoryText
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      index: 'title',
      width: 180,
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      index: 'companyName',
      width: 240,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      index: 'phone',
      width: 150,
    },
    {
      title: '反馈用户',
      dataIndex: 'createdBy',
      index: 'createdBy',
      width: 200,
      render: (text: any, record: any) => {
        return record.createdByUserName
      },
    },
    {
      title: '附件',
      dataIndex: 'fileName',
      index: 'fileName',
      width: 200,
      render: (text: any, record: any) => {
        return record.fileName
      },
    },
  ]

  const deleteEvent = async () => {
    // await deleteCompany(checkRadioValue)
    message.success('删除成功')
    // tableSearchEvent()
  }

  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]
    const geom = editData.geom
      .substring(editData.geom.indexOf('(') + 1, editData.geom.indexOf(')'))
      .split(' ')

    subForm.setFieldsValue({
      ...editData,
      kvLevel: kvOptions[editData.kvLevel],
      lng: geom[0],
      lat: geom[1],
    })
    setFormVisible(true)

    // tableSearchEvent()
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
    if (subStationRef && subStationRef.current) {
      // @ts-ignore
      subStationRef.current.search()
    }
  }

  const searchComponent = () => {
    return (
      <div>
        <TableSearch width="248px">
          <Search
            value={subStationKeyWord}
            onChange={(e: any) => setSubStationKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入变电站名称"
          />
        </TableSearch>
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
              ref={subStationRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={subStationColumns}
              url="/TransformerSubstation/GetPagedList"
              tableTitle="电源"
              getSelectData={(data) => setTableSelectRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: subStationKeyWord,
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
        // onOk={() => setFormVisible(false)}
      >
        <Form form={currentTab === 'subStations' ? subForm : powerForm}>
          <SubStationPowerForm currentEditTab={currentTab} />
        </Form>
      </Modal>
    </>
  )
}

export default StandingBook
