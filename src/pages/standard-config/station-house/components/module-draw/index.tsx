import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { downLoadFileItem } from '@/services/operation-config/company-file'
import { useControllableValue } from 'ahooks'
import { Button, Input, message, Modal, Spin } from 'antd'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import ImportScheme from '../import-scheme'
import styles from './index.less'

interface StandingBookProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
}

const { Search } = Input

const ModuleDraw: React.FC<StandingBookProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  const tableRef = useRef<HTMLDivElement>(null)

  // 下载loading
  const [loading, setLoading] = useState<boolean>(false)

  // 导入模板图纸模态框
  const [importVisible, setImportVisible] = useState<boolean>(false)

  // 图纸下载
  const downloadDraw = async (fileId: string, fileName: string) => {
    try {
      setLoading(true)
      const res = await downLoadFileItem({ fileId })
      const suffix = fileName?.substring(fileName.lastIndexOf('.') + 1)
      const blob = new Blob([res], {
        type: `application/${suffix}`,
      })
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        // for Non-IE
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }
      message.success('下载成功')
      setLoading(false)
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // 方案图纸
  const drawColumns = [
    {
      title: '图纸名称',
      dataIndex: 'name',
      index: 'name',
      width: 160,
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <span className="canClick" onClick={() => downloadDraw(record.fileId, record.name)}>
            <u>下载</u>
          </span>
        )
      },
    },
  ]

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        keyWord: searchKeyWord,
      })
    }
  }

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入关键词"
          />
        </TableSearch>
      </div>
    )
  }

  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }
  // 导入后刷新列表
  const importFinishEvent = () => {
    refresh()
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button className="mr7" type="primary" onClick={() => setImportVisible(true)}>
          导入模版图纸
        </Button>
      </div>
    )
  }

  return (
    <>
      <Modal
        maskClosable={false}
        bodyStyle={{ padding: '24px 24px 0' }}
        title="站房模板图纸"
        width="80%"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        footer=""
        cancelText="取消"
        onCancel={() => {
          setState(false)
        }}
      >
        <Spin spinning={loading} tip="下载中...">
          <GeneralTable
            ref={tableRef}
            style={{ height: '500px' }}
            buttonLeftContentSlot={searchComponent}
            buttonRightContentSlot={tableElement}
            columns={drawColumns}
            url="/StationScheme/QueryStationTemplateChartPage"
            tableTitle="站房模版图纸"
            requestSource="resource"
            notShowSelect
            extractParams={{
              keyWord: searchKeyWord,
            }}
          />
        </Spin>
      </Modal>

      {/* 导入站房模版图纸 */}
      <ImportScheme
        visible={importVisible}
        changeFinishEvent={() => importFinishEvent()}
        onChange={setImportVisible}
        url="/StationScheme/ImportStationTemplateChart"
        title="站房模版图纸导入"
        accept=".zip"
      />
    </>
  )
}

export default ModuleDraw
