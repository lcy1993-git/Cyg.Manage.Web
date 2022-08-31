import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { Input, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { getUploadUrl } from '@/services/resource-config/drawing'
import { useRequest } from 'ahooks'
import { ImportOutlined, EditOutlined } from '@ant-design/icons'
import ImportChartModal from './component/import-form'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import ModalConfirm from '@/components/modal-confirm'

interface libParams {
  libId: string
}

const { Search } = Input
const Drawing: React.FC<libParams> = (props) => {
  const { libId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false)
  const [resourceLibId, setResourceLibId] = useState<string | undefined>('')
  const { data: keyData } = useRequest(() => getUploadUrl())

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
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 240,
    },

    {
      dataIndex: 'chartName',
      index: 'chartName',
      title: '图纸名称',
    },
  ]

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

  const importChartEvent = () => {}
  const importBatchChartEvent = () => {
    // if (!resourceLibId) {
    //   message.error('请先选择资源库');
    //   return;
    // }
    setImportFormVisible(true)
  }
  const editChartEvent = () => {}
  const deleteBatchChartEvent = () => {}

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
        type="radio"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />
      <ImportChartModal
        libId={libId}
        securityKey={chartSecurityKey}
        requestSource="upload"
        visible={importFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportFormVisible}
      />
      {/* </PageCommonWrap> */}
    </>
  )
}

export default Drawing
