import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import { deleteDrawingItems, getUploadUrl } from '@/services/resource-config/drawing'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, ImportOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Input, message } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import ImportBatchChartModal from './component/import-batch-form'
import ImportChartModal from './component/import-form'
import styles from './index.less'

const mapCategory = {
  Material: '物料',
  Component: '组件',
  Cable: '电缆',
  Overhead: '架空',
}

const mapType = {
  DesignChart: '设计图',
  ProcessChart: '加工图',
  TowerModelChart: '杆型一览图',
}

interface libParams {
  libId: string
}

const { Search } = Input
const Drawing: React.FC<libParams> = (props) => {
  const { libId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [importBatchFormVisible, setImportBatchFormVisible] = useState<boolean>(false)
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [resourceLibId, setResourceLibId] = useState<string | undefined>('')
  const { data: keyData } = useRequest(() => getUploadUrl())
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [editChartId, setEditChartId] = useState<string>()

  const chartSecurityKey = keyData?.uploadChartApiSecurity
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入图纸信息"
          />
        </TableSearch>
      </div>
    )
  }

  //选择资源库传libId
  const searchByLib = (value: any) => {
    setResourceLibId(value)
    search()
  }

  useEffect(() => {
    searchByLib(resourceLibId)
  }, [resourceLibId])

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const columns = [
    {
      dataIndex: 'chartId',
      index: 'chartId',
      title: '图纸编号',
      width: 240,
    },

    {
      dataIndex: 'category',
      index: 'category',
      title: '类别',
      width: 240,
      render: (text: any, row: any) => {
        return mapCategory[text]
      },
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 240,
      render: (text: any, row: any) => {
        return mapType[text]
      },
    },

    {
      dataIndex: 'chartName',
      index: 'chartName',
      title: '图纸名称',
    },
  ]
  const sureDeleteData = async () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库');
    //   return;
    // }

    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择需要删除的行')
      return
    }
    const deleteIds = tableSelectRows?.map((item) => item.id)

    await deleteDrawingItems({ libId: libId, ids: deleteIds })
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('drawing-import') && (
          <Button className="mr7" onClick={() => importChartEvent()}>
            <ImportOutlined />
            导入图纸
          </Button>
        )}
        {buttonJurisdictionArray?.includes('drawing-import') && (
          <Button className="mr7" onClick={() => importBatchChartEvent()}>
            <ImportOutlined />
            批量导入图纸
          </Button>
        )}
        {buttonJurisdictionArray?.includes('drawing-import') && (
          <Button className="mr7" onClick={() => editChartEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {/* {buttonJurisdictionArray?.includes('drawing-import') && (
          <Button className="mr7" onClick={() => deleteBatchChartEvent()}>
            <ImportOutlined />
            删除
          </Button>
        )} */}
        {buttonJurisdictionArray?.includes('drawing-import') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
      </div>
    )
  }

  const importChartEvent = () => {
    setImportFormVisible(true)
  }
  const importBatchChartEvent = () => {
    // if (!resourceLibId) {
    //   message.error('请先选择资源库');
    //   return;
    // }
    setImportBatchFormVisible(true)
  }
  const editChartEvent = () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]

    setEditFormVisible(true)
    // @ts-ignore
    editFormModalRef.current?.setFormValues(editData)
    setEditChartId(editData.chartId)
  }
  const editFormModalRef = useRef()

  return (
    <>
      {/* <PageCommonWrap> */}
      <GeneralTable
        rowKey="chartId"
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/Chart/GetPageList"
        // tableTitle="图纸"
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
        getSelectData={(data) => setTableSelectRows(data)}
      />
      <ImportBatchChartModal
        libId={libId}
        securityKey={chartSecurityKey}
        requestSource="upload"
        visible={importBatchFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportBatchFormVisible}
      />
      <ImportChartModal
        libId={libId}
        visible={importFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportFormVisible}
        title="导入图纸"
      />
      <ImportChartModal
        libId={libId}
        visible={editFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setEditFormVisible}
        title="编辑图纸"
        ref={editFormModalRef}
        chartId={editChartId}
      />
      {/* </PageCommonWrap> */}
    </>
  )
}

export default Drawing
