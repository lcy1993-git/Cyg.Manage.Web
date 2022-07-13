import { useControllableValue, useUpdateEffect } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import { Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import GeneralTable from '@/components/general-table'
import { EditOutlined } from '@ant-design/icons'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
// import SubStationPowerForm from './components/subStation-power-form'
import { isArray } from 'lodash'
import {
  deleteBoxTransformer,
  deleteCableBranchBox,
  deleteCableWell,
  deleteColumnCircuitBreaker,
  deleteColumnTransformer,
  deleteElectricityDistributionRoom,
  deleteLineRelations,
  deleteRingNetworkCabinet,
  deleteSwitchingStation,
  deleteTower,
  modifyBoxTransformer,
  modifyCableBranchBox,
  modifyCableWell,
  modifyColumnCircuitBreaker,
  modifyColumnTransformer,
  modifyElectricityDistributionRoom,
  modifyRelationLine,
  modifyRingNetworkCabinet,
  modifySwitchingStation,
  modifyTower,
} from '@/services/grid-manage/treeMenu'
import { handleGeom } from '../../utils/methods'
import EquipForm from './components/equip-form'
import {
  boxTransColumns,
  breakerColumns,
  cabinetColumns,
  cableBoxColumns,
  cableWellColumns,
  columnTransColumns,
  elecRoomColumns,
  lineColumns,
  switchColumns,
  towerColumns,
} from './components/equip-columns'
import { useMyContext } from '../../grid-manage/Context'

const { TabPane } = Tabs

interface StandingBookProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  lineTitle?: string
  lineId: string
}

const tabTitle = {
  line: '线路段',
  cableWell: '电缆井',
  tower: '杆塔',
  boxTrans: '箱变',
  cabinet: '环网柜',
  elecRoom: '配电室',
  switchStation: '开闭所',
  breaker: '柱上断路器',
  columnTrans: '柱上变压器',
  cableBox: '电缆分支箱',
}

const { Search } = Input

const EquipLineList: React.FC<StandingBookProps> = (props) => {
  const { companyId } = useMyContext()
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { lineTitle, lineId } = props

  const [lineType, setLineType] = useState<'Line' | 'CableCircuit'>('Line')

  const [cableWellKey, setCableWellKey] = useState<string>('')
  const [towerKey, setTowerKey] = useState<string>('')
  const [boxTransKey, setBoxTranskey] = useState<string>('')
  const [cabinetKey, setCabinetKey] = useState<string>('')
  const [elecRoomKey, setElecRoomKey] = useState<string>('')
  const [switchKey, setSwitchKey] = useState<string>('')
  const [breakerKey, setBreakerKey] = useState<string>('')
  const [columnTransKey, setColumnTransKey] = useState<string>('')
  const [cableBoxKey, setCableBoxKey] = useState<string>('')

  //表格ref
  const lineRef = useRef<HTMLDivElement>(null)
  const boxTransRef = useRef<HTMLDivElement>(null)
  const cableBoxRef = useRef<HTMLDivElement>(null)
  const cableWellRef = useRef<HTMLDivElement>(null)
  const breakerRef = useRef<HTMLDivElement>(null)
  const columnTransRef = useRef<HTMLDivElement>(null)
  const elecRoomRef = useRef<HTMLDivElement>(null)
  const cabinetRef = useRef<HTMLDivElement>(null)
  const switchRef = useRef<HTMLDivElement>(null)
  const towerRef = useRef<HTMLDivElement>(null)

  //表格选中
  const [lineRows, setLineRows] = useState<any[]>([])
  const [boxTransRows, setBoxTransRows] = useState<any[]>([])
  const [cableBoxRows, setCableBoxRows] = useState<any[]>([])
  const [cableWellRows, setCableWellRows] = useState<any[]>([])
  const [breakerRows, setBreakerRows] = useState<any[]>([])
  const [columnTransRows, setColumnTransRows] = useState<any[]>([])
  const [elecRoomRows, setElecRoomRows] = useState<any[]>([])
  const [cabinetRows, setCabinetRows] = useState<any[]>([])
  const [switchRows, setSwitchRows] = useState<any[]>([])
  const [towerRows, setTowerRows] = useState<any[]>([])

  //当前Tab
  const [currentTab, setCurrentTab] = useState<string>('line')

  const [formVisible, setFormVisible] = useState<boolean>(false)

  const [lineForm] = Form.useForm()
  const [boxTransForm] = Form.useForm()
  const [cableBoxForm] = Form.useForm()
  const [cableWellForm] = Form.useForm()
  const [breakerForm] = Form.useForm()
  const [columnTransForm] = Form.useForm()
  const [elecRoomForm] = Form.useForm()
  const [cabinetForm] = Form.useForm()
  const [switchForm] = Form.useForm()
  const [towerForm] = Form.useForm()

  // const { data, run } = useRequest(getAuthorizationDetail, {
  //   manual: true,
  // })

  const refresh = () => {
    if (currentTab === 'line') {
      if (lineRef && lineRef.current) {
        // @ts-ignore
        lineRef.current.refresh()
      }
      return
    }
    if (currentTab === 'cableWell') {
      if (cableWellRef && cableWellRef.current) {
        // @ts-ignore
        cableWellRef.current.refresh()
      }
      return
    }
    if (currentTab === 'tower') {
      if (towerRef && towerRef.current) {
        // @ts-ignore
        towerRef.current.refresh()
      }
      return
    }
    if (currentTab === 'boxTrans') {
      if (boxTransRef && boxTransRef.current) {
        // @ts-ignore
        boxTransRef.current.refresh()
      }
      return
    }
    if (currentTab === 'cabinet') {
      if (cabinetRef && cabinetRef.current) {
        // @ts-ignore
        cabinetRef.current.refresh()
      }
      return
    }
    if (currentTab === 'elecRoom') {
      if (elecRoomRef && elecRoomRef.current) {
        // @ts-ignore
        elecRoomRef.current.refresh()
      }
      return
    }
    if (currentTab === 'switchStation') {
      if (switchRef && switchRef.current) {
        // @ts-ignore
        switchRef.current.refresh()
      }
      return
    }
    if (currentTab === 'breaker') {
      if (breakerRef && breakerRef.current) {
        // @ts-ignore
        breakerRef.current.refresh()
      }
      return
    }
    if (currentTab === 'columnTrans') {
      if (columnTransRef && columnTransRef.current) {
        // @ts-ignore
        columnTransRef.current.refresh()
      }
      return
    }
    if (currentTab === 'cableBox') {
      if (cableBoxRef && cableBoxRef.current) {
        // @ts-ignore
        cableBoxRef.current.refresh()
      }
    }
  }

  const deleteEvent = async (currentTab: string) => {
    switch (currentTab) {
      case 'line':
        await deleteLineRelations([lineRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'cableWell':
        await deleteCableWell([cableWellRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'tower':
        await deleteTower([towerRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'boxTrans':
        await deleteBoxTransformer([boxTransRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'cabinet':
        await deleteRingNetworkCabinet([cabinetRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'elecRoom':
        await deleteElectricityDistributionRoom([elecRoomRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'switchStation':
        await deleteSwitchingStation([switchRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'breaker':
        await deleteColumnCircuitBreaker([breakerRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'columnTrans':
        await deleteColumnTransformer([columnTransRows[0].id])
        message.success('删除成功')
        refresh()
        break
      case 'cableBox':
        await deleteCableBranchBox([cableBoxRows[0].id])
        message.success('删除成功')
        refresh()
        break
      default:
        return
    }
  }

  //坐标处理
  const editEvent = async () => {
    if (currentTab === 'line') {
      if (lineRows && isArray(lineRows) && lineRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = lineRows[0]

      lineForm.setFieldsValue({
        ...editData,
        lineId: editData.lineId,
        isOverhead: editData.isOverhead ? 'Line' : 'CableCircuit',
      })
      setLineType(editData.isOverhead ? 'Line' : 'CableCircuit')
      setFormVisible(true)
      return
    }

    if (currentTab === 'cableWell') {
      if (cableWellRows && isArray(cableWellRows) && cableWellRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = cableWellRows[0]
      const geom = handleGeom(editData.geom)
      cableWellForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }

    if (currentTab === 'tower') {
      if (towerRows && isArray(towerRows) && towerRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = towerRows[0]
      const geom = handleGeom(editData.geom)

      towerForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }

    if (currentTab === 'boxTrans') {
      if (boxTransRows && isArray(boxTransRows) && boxTransRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = boxTransRows[0]
      const geom = handleGeom(editData.geom)

      boxTransForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }

    if (currentTab === 'cabinet') {
      if (cabinetRows && isArray(cabinetRows) && cabinetRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = cabinetRows[0]
      const geom = handleGeom(editData.geom)
      cabinetForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }
    if (currentTab === 'elecRoom') {
      if (elecRoomRows && isArray(elecRoomRows) && elecRoomRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = elecRoomRows[0]
      const geom = handleGeom(editData.geom)

      elecRoomForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }
    if (currentTab === 'switchStation') {
      if (switchRows && isArray(switchRows) && switchRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = switchRows[0]
      const geom = handleGeom(editData.geom)

      switchForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }
    if (currentTab === 'breaker') {
      if (breakerRows && isArray(breakerRows) && breakerRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = breakerRows[0]
      const geom = handleGeom(editData.geom)

      breakerForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }
    if (currentTab === 'columnTrans') {
      if (columnTransRows && isArray(columnTransRows) && columnTransRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = columnTransRows[0]
      const geom = handleGeom(editData.geom)

      columnTransForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
      return
    }

    if (currentTab === 'cableBox') {
      if (cableBoxRows && isArray(cableBoxRows) && cableBoxRows.length === 0) {
        message.warning('请选择一条数据进行编辑')
        return
      }
      const editData = cableBoxRows[0]
      const geom = handleGeom(editData.geom)

      cableBoxForm.setFieldsValue({
        ...editData,
        lng: geom[0],
        lat: geom[1],
      })
      setFormVisible(true)
    }
  }

  //
  const sureEditEvent = () => {
    if (currentTab === 'line') {
      const editData = lineRows[0]

      lineForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          ...values,
          isOverhead: editData.isOverhead,
          color: editData.color,
        }

        await modifyRelationLine(submitInfo)
        lineForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    //
    if (currentTab === 'cableWell') {
      const editData = cableWellRows[0]
      cableWellForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyCableWell(submitInfo)
        cableWellForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }

    if (currentTab === 'tower') {
      const editData = towerRows[0]
      towerForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyTower(submitInfo)
        towerForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    if (currentTab === 'boxTrans') {
      const editData = boxTransRows[0]
      boxTransForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyBoxTransformer(submitInfo)
        boxTransForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    if (currentTab === 'cabinet') {
      const editData = cabinetRows[0]
      cabinetForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyRingNetworkCabinet(submitInfo)
        cabinetForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    if (currentTab === 'elecRoom') {
      const editData = elecRoomRows[0]
      elecRoomForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyElectricityDistributionRoom(submitInfo)
        elecRoomForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }

    if (currentTab === 'switchStation') {
      const editData = switchRows[0]
      switchForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifySwitchingStation(submitInfo)
        switchForm.resetFields()

        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    if (currentTab === 'breaker') {
      const editData = breakerRows[0]
      breakerForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyColumnCircuitBreaker(submitInfo)
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    if (currentTab === 'columnTrans') {
      const editData = columnTransRows[0]
      columnTransForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyColumnTransformer(submitInfo)
        columnTransForm.resetFields()

        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
    if (currentTab === 'cableBox') {
      const editData = cableBoxRows[0]
      cableBoxForm.validateFields().then(async (values) => {
        const submitInfo = {
          id: editData.id,
          geom: `POINT (${values.lng} ${values.lat})`,
          ...values,
          color: editData.color,
        }
        await modifyCableBranchBox(submitInfo)
        cableBoxForm.resetFields()
        refresh()
        message.success('更新成功')
        setFormVisible(false)
      })
      return
    }
  }

  //操作权限判断
  const canEdit = () => {
    if (
      (lineRows[0] && lineRows[0].companyId !== companyId) ||
      (cableWellRows[0] && cableWellRows[0].companyId !== companyId) ||
      (towerRows[0] && towerRows[0].companyId !== companyId) ||
      (boxTransRows[0] && boxTransRows[0].companyId !== companyId) ||
      (cabinetRows[0] && cabinetRows[0].companyId !== companyId) ||
      (elecRoomRows[0] && elecRoomRows[0].companyId !== companyId) ||
      (switchRows[0] && switchRows[0].companyId !== companyId) ||
      (breakerRows[0] && breakerRows[0].companyId !== companyId) ||
      (columnTransRows[0] && columnTransRows[0].companyId !== companyId) ||
      (cableBoxRows[0] && cableBoxRows[0].companyId !== companyId)
    ) {
      return true
    }
    return false
  }

  const getCurrentRow = (currentTab: string) => {
    switch (currentTab) {
      case 'line':
        return lineRows
      case 'cableWell':
        return cableWellRows
      case 'boxTrans':
        return boxTransRows
      case 'cabinet':
        return cabinetRows
      case 'elecRoom':
        return elecRoomRows
      case 'switchStation':
        return switchRows
      case 'breaker':
        return breakerRows
      case 'columnTrans':
        return columnTransRows
      case 'cableBox':
        return cableBoxRows
      case 'tower':
        return towerRows
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
          changeEvent={() => deleteEvent(currentTab)}
          disabled={canEdit()}
          selectData={getCurrentRow(currentTab)}
          // contentSlot={deleteContent}
        />
        {/* )} */}
      </div>
    )
  }

  const search = () => {
    if (currentTab === 'line') {
      if (lineRef && lineRef.current) {
        // @ts-ignore
        lineRef.current.search()
      }
      return
    }
    if (currentTab === 'cableWell') {
      if (cableWellRef && cableWellRef.current) {
        // @ts-ignore
        cableWellRef.current.search()
      }
      return
    }
    if (currentTab === 'tower') {
      if (towerRef && towerRef.current) {
        // @ts-ignore
        towerRef.current.search()
      }
      return
    }
    if (currentTab === 'boxTrans') {
      if (boxTransRef && boxTransRef.current) {
        // @ts-ignore
        boxTransRef.current.search()
      }
      return
    }
    if (currentTab === 'cabinet') {
      if (cabinetRef && cabinetRef.current) {
        // @ts-ignore
        cabinetRef.current.search()
      }
      return
    }
    if (currentTab === 'elecRoom') {
      if (elecRoomRef && elecRoomRef.current) {
        // @ts-ignore
        elecRoomRef.current.search()
      }
      return
    }
    if (currentTab === 'switchStation') {
      if (switchRef && switchRef.current) {
        // @ts-ignore
        switchRef.current.search()
      }
      return
    }
    if (currentTab === 'breaker') {
      if (breakerRef && breakerRef.current) {
        // @ts-ignore
        breakerRef.current.search()
      }
      return
    }
    if (currentTab === 'columnTrans') {
      if (columnTransRef && columnTransRef.current) {
        // @ts-ignore
        columnTransRef.current.search()
      }
      return
    }
    if (currentTab === 'cableBox') {
      if (cableBoxRef && cableBoxRef.current) {
        // @ts-ignore
        cableBoxRef.current.search()
      }
    }
  }

  const searchComponent = () => {
    return (
      <div>
        {currentTab === 'cableWell' ? (
          <TableSearch width="248px">
            <Search
              value={cableWellKey}
              onChange={(e: any) => setCableWellKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入电缆井名称"
            />
          </TableSearch>
        ) : currentTab === 'tower' ? (
          <TableSearch width="248px">
            <Search
              value={towerKey}
              onChange={(e: any) => setTowerKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入杆塔名称"
            />
          </TableSearch>
        ) : currentTab === 'boxTrans' ? (
          <TableSearch width="248px">
            <Search
              value={boxTransKey}
              onChange={(e: any) => setBoxTranskey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入箱变名称"
            />
          </TableSearch>
        ) : currentTab === 'cabinet' ? (
          <TableSearch width="248px">
            <Search
              value={cabinetKey}
              onChange={(e: any) => setCabinetKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入环网柜名称"
            />
          </TableSearch>
        ) : currentTab === 'elecRoom' ? (
          <TableSearch width="248px">
            <Search
              value={elecRoomKey}
              onChange={(e: any) => setElecRoomKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入配电室名称"
            />
          </TableSearch>
        ) : currentTab === 'switchStation' ? (
          <TableSearch width="248px">
            <Search
              value={switchKey}
              onChange={(e: any) => setSwitchKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入开闭所名称"
            />
          </TableSearch>
        ) : currentTab === 'breaker' ? (
          <TableSearch width="248px">
            <Search
              value={breakerKey}
              onChange={(e: any) => setBreakerKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入柱上断路器名称"
            />
          </TableSearch>
        ) : currentTab === 'columnTrans' ? (
          <TableSearch width="248px">
            <Search
              value={columnTransKey}
              onChange={(e: any) => setColumnTransKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入柱上变压器名称"
            />
          </TableSearch>
        ) : (
          <TableSearch width="248px">
            <Search
              value={cableBoxKey}
              onChange={(e: any) => setCableBoxKey(e.target.value)}
              onSearch={() => search()}
              enterButton
              placeholder="请输入电缆分支箱名称"
            />
          </TableSearch>
        )}
      </div>
    )
  }

  //返回当前form
  const getCurrentForm = (currentTab: string) => {
    switch (currentTab) {
      case 'line':
        return lineForm
      case 'cableWell':
        return cableWellForm
      case 'tower':
        return towerForm
      case 'boxTrans':
        return boxTransForm
      case 'cabinet':
        return cabinetForm
      case 'elecRoom':
        return elecRoomForm
      case 'switchStation':
        return switchForm
      case 'breaker':
        return breakerForm
      case 'columnTrans':
        return columnTransForm
      case 'cableBox':
        return cableBoxForm
      default:
        return
    }
  }

  useUpdateEffect(() => {
    if (!state) {
      setLineRows([])
      setCableWellRows([])
      setSwitchRows([])
      setBoxTransRows([])
      setCabinetRows([])
      setElecRoomRows([])
      setBreakerRows([])
      setColumnTransRows([])
      setTowerRows([])
      setCableBoxRows([])
      setCurrentTab('line')
    }
  }, [state])

  return (
    <>
      <Modal
        maskClosable={false}
        bodyStyle={{ padding: '24px 24px 0' }}
        title={`${lineTitle}台账信息`}
        width="70%"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        footer=""
        cancelText="取消"
        onCancel={() => setState(false)}
      >
        <Tabs tabPosition="bottom" onChange={(value: string) => setCurrentTab(value)}>
          <TabPane tab="线路段" key="line">
            <GeneralTable
              ref={lineRef}
              style={{ height: '400px' }}
              buttonRightContentSlot={tableButton}
              buttonLeftContentSlot={searchComponent}
              columns={lineColumns}
              url="/LineElementRelation/GetPagedList"
              tableTitle="线路段"
              getSelectData={(data) => setLineRows(data)}
              requestSource="grid"
              extractParams={{
                // keyWord: subStationKeyWord,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="电缆井" key="cableWell">
            <GeneralTable
              ref={cableWellRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={cableWellColumns}
              url="/CableWell/GetPagedList"
              tableTitle="电缆井"
              getSelectData={(data) => setCableWellRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: cableWellKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="杆塔" key="tower">
            <GeneralTable
              ref={towerRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={towerColumns}
              url="/Tower/GetPagedList"
              tableTitle="杆塔"
              getSelectData={(data) => setTowerRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: towerKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="箱变" key="boxTrans">
            <GeneralTable
              ref={boxTransRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={boxTransColumns}
              url="/BoxTransformer/GetPagedList"
              tableTitle="箱变"
              getSelectData={(data) => setBoxTransRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: boxTransKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="环网柜" key="cabinet">
            <GeneralTable
              ref={cabinetRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={cabinetColumns}
              url="/RingNetworkCabinet/GetPagedList"
              tableTitle="环网柜"
              getSelectData={(data) => setCabinetRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: cabinetKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="配电室" key="elecRoom">
            <GeneralTable
              ref={elecRoomRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={elecRoomColumns}
              url="/ElectricityDistributionRoom/GetPagedList"
              tableTitle="配电室"
              getSelectData={(data) => setElecRoomRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: elecRoomKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="开闭所" key="switchStation">
            <GeneralTable
              ref={switchRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={switchColumns}
              url="/SwitchingStation/GetPagedList"
              tableTitle="开闭所"
              getSelectData={(data) => setSwitchRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: switchKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="柱上断路器" key="breaker">
            <GeneralTable
              ref={breakerRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={breakerColumns}
              url="/ColumnCircuitBreaker/GetPagedList"
              tableTitle="柱上断路器"
              getSelectData={(data) => setBreakerRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: breakerKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="柱上变压器" key="columnTrans">
            <GeneralTable
              ref={columnTransRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={columnTransColumns}
              url="/ColumnTransformer/GetPagedList"
              tableTitle="柱上变压器"
              getSelectData={(data) => setColumnTransRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: columnTransKey,
                lineId: lineId,
              }}
            />
          </TabPane>
          <TabPane tab="电缆分支箱" key="cableBox">
            <GeneralTable
              ref={cableBoxRef}
              style={{ height: '400px' }}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableButton}
              columns={cableBoxColumns}
              url="/CableBranchBox/GetPagedList"
              tableTitle="电缆分支箱"
              getSelectData={(data) => setCableBoxRows(data)}
              requestSource="grid"
              extractParams={{
                keyWord: cableBoxKey,
                lineId: lineId,
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
        <Form form={getCurrentForm(currentTab)}>
          <EquipForm currentEditTab={currentTab} selectLineType={lineType} />
        </Form>
      </Modal>
    </>
  )
}

export default EquipLineList
