import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less'
// import TableImportButton from '@/components/table-import-button';
import { getUploadUrl } from '@/services/resource-config/drawing'
import { useMount, useRequest, useUnmount } from 'ahooks'
import { message } from 'antd'
import EditLineStressSag from './components/edit-lineStressSag'
import ImportLineStressSag from './components/import-lineStressSag'
import UploadLineStressSag from './components/upload-lineStressSag'
// import FileUploadOnline from '@/components/file-upload-online';
// import CygFormItem from '@/components/cy-form-item';
// import CommonTitle from '@/components/common-title'
import { useLayoutStore } from '@/layouts/context'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, ImportOutlined } from '@ant-design/icons'
import { isArray } from 'lodash'
import qs from 'qs'

const { Search } = Input

interface libParams {
  // libId: string
}

const LineStressSag: React.FC<libParams> = () => {
  const { setLineStressSagFlag } = useLayoutStore()

  useMount(() => {
    setLineStressSagFlag?.(true)
  })

  useUnmount(() => {
    setLineStressSagFlag?.(false)
  })
  const libId = qs.parse(window.location.href.split('?')[1]).libId as string
  // const libName = qs.parse(window.location.href.split('?')[1]).libName as string
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [resourceLibId, setResourceLibId] = useState<string | undefined>('')
  const [uploadLineStressSagVisible, setUploadLineStreesSagVisible] = useState<boolean>(false)
  const [importLineStressSagVisible, setImportLineStreesSagVisible] = useState<boolean>(false)
  const [editLineStressSagVisible, setEditLineStreesSagVisible] = useState<boolean>(false)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])

  const { data: keyData } = useRequest(() => getUploadUrl())
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const LineStressChartApiSecurity = keyData?.uploadLineStressChartApiSecurity

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="298px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入应力弧垂表信息"
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

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const columns = [
    {
      dataIndex: 'meteorologic',
      index: 'meteorologic',
      title: '气象区',
      width: 140,
    },
    {
      dataIndex: 'spec',
      index: 'spec',
      title: '导线型号',
      width: 220,
    },
    {
      dataIndex: 'spanPoint',
      index: 'spanPoint',
      title: '档距点',
      width: 80,
    },
    {
      dataIndex: 'temperature',
      index: 'temperature',
      title: '温度',
      width: 80,
    },
    {
      dataIndex: 'stress',
      index: 'stress',
      title: '应力',
      width: 100,
    },
    {
      dataIndex: 'comparativeLoad',
      index: 'comparativeLoad',
      title: '综合比值',
      width: 100,
    },
    {
      dataIndex: 'kValue',
      index: 'kValue',
      title: 'K值',
      width: 180,
    },
    {
      dataIndex: 'chartName',
      index: 'chartName',
      title: '应力弧垂表图纸',
    },

    {
      dataIndex: 'safetyFactor',
      index: 'safetyFactor',
      title: '安全系数',
      width: 140,
    },
  ]

  const uploadFinishEvent = () => {
    refresh()
    resetTable()
  }

  const resetTable = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.resetSelectedRows()
    }
  }

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('edit-line-stress-sag') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('line-stress-sag-import') && (
          <Button className="mr7" onClick={() => importLineStressEvent()}>
            导入应力弧垂表
          </Button>
        )}

        {buttonJurisdictionArray?.includes('line-stress-sag-upload-drawing') && (
          <Button className="mr7" onClick={() => importLineStressDrawingEvent()}>
            <ImportOutlined />
            上传图纸
          </Button>
        )}
      </div>
    )
  }

  const importLineStressEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请选择资源库');
    //   return;
    // }
    setImportLineStreesSagVisible(true)
  }

  const importLineStressDrawingEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请选择资源库');
    //   return;
    // }
    setUploadLineStreesSagVisible(true)
  }
  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    setEditLineStreesSagVisible(true)
  }

  return (
    <>
      <PageCommonWrap>
        {/* <div className={styles.moduleTitle}>
          <CommonTitle>{libName}</CommonTitle>
        </div> */}
        <GeneralTable
          rowKey="id"
          ref={tableRef}
          buttonLeftContentSlot={searchComponent}
          buttonRightContentSlot={tableElement}
          columns={columns}
          requestSource="resource"
          url="/LineStressSag/GetLineStressSagMappingPageList"
          tableTitle="应力弧垂表"
          type="radio"
          extractParams={{
            keyWord: searchKeyWord,
            resourceLibId: '',
          }}
          getSelectData={(data) => setTableSelectRows(data)}
        />

        <EditLineStressSag
          visible={editLineStressSagVisible}
          libId={libId}
          row={tableSelectRows[0]}
          changeFinishEvent={() => uploadFinishEvent()}
          onChange={setEditLineStreesSagVisible}
        />

        <UploadLineStressSag
          libId={libId}
          securityKey={LineStressChartApiSecurity}
          visible={uploadLineStressSagVisible}
          changeFinishEvent={() => uploadFinishEvent()}
          onChange={setUploadLineStreesSagVisible}
        />

        <ImportLineStressSag
          libId={libId}
          requestSource="resource"
          visible={importLineStressSagVisible}
          changeFinishEvent={() => uploadFinishEvent()}
          onChange={setImportLineStreesSagVisible}
        />
      </PageCommonWrap>
    </>
  )
}

export default LineStressSag
