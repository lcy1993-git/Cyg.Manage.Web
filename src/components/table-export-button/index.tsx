import { commonExport } from '@/services/common'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, message } from 'antd'
import React from 'react'

interface TableExportButtonProps {
  selectIds?: string[]
  exportUrl: string
  extraParams?: object
  fileName?: string
  selectSlot?: () => React.ReactNode
}

const TableExportButton: React.FC<TableExportButtonProps> = (props) => {
  const { selectIds = [], exportUrl = '', extraParams, fileName = '表格', selectSlot } = props
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const exportChoosedRow = async () => {
    if (selectIds && selectIds.length === 0) {
      message.error('请选择需要导出的数据')
      return
    }
    const res = await commonExport(exportUrl, extraParams, selectIds)
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    })
    let finalyFileName = `${fileName}.xlsx`
    // for IE
    //@ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //@ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', finalyFileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
    message.success('导出成功')
  }

  const exportAllRow = async () => {
    const res = await commonExport(exportUrl, extraParams, [])
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    })
    let finalyFileName = `${fileName}.xlsx`
    // for IE
    //@ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //@ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', finalyFileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
    message.success('导出成功')
  }

  const importButoonMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-export-selected') && (
        <Menu.Item key="exportPart" onClick={() => exportChoosedRow()}>
          导出所选
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-export-all') && (
        <Menu.Item key="exportAll" onClick={() => exportAllRow()}>
          导出所有
        </Menu.Item>
      )}
      {selectSlot ? <Menu.Item>{selectSlot?.()}</Menu.Item> : null}
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={importButoonMenu}>
        <Button>
          导出 <DownOutlined />
        </Button>
      </Dropdown>
    </>
  )
}

export default TableExportButton
