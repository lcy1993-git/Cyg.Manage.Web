import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { ImportOutlined, QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons'
import { Input, Button, message, Tooltip, Dropdown, Menu } from 'antd'
import React, { useState, useMemo } from 'react'
import styles from './index.less'
import { restartResourceLib } from '@/services/resource-config/resource-lib'
import { isArray } from 'lodash'
import SaveImportLineStressSag from '../canon-resource-lib/components/upload-lineStressSag'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import EnumSelect from '@/components/enum-select'
import { BelongManageEnum } from '@/services/personnel-config/manage-user'
import { history } from 'umi'
import { useLayoutStore } from '@/layouts/context'

const { Search } = Input

const LineStressSag: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  const [uploadLineStressSagVisible, setUploadLineStressSagVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [status, setStatus] = useState<string>('0')
  const [libId, setLibId] = useState<string>('')

  const { lineStressSagFlag } = useLayoutStore()

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入资源库"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="资源库状态" width="300px">
          <EnumSelect
            enumList={BelongManageEnum}
            onChange={(value) => searchByStatus(value)}
            placeholder="-全部-"
          />
        </TableSearch>
      </div>
    )
  }

  const searchByStatus = (value: any) => {
    setStatus(value)
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        status: value,
      })
    }
  }

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }
  const columns = useMemo(() => {
    if (!lineStressSagFlag) {
      return [
        {
          dataIndex: 'libName',
          index: 'libName',
          title: '名称',
          width: 280,
        },
        {
          dataIndex: 'version',
          index: 'version',
          title: '版本',
          width: 140,
        },
        {
          dataIndex: 'remark',
          index: 'remark',
          title: '备注',
        },
        {
          dataIndex: 'action',
          title: '操作',
          width: 100,
          render: (text: any, record: any) => {
            return (
              <span
                className="canClick"
                onClick={() => {
                  history.push({
                    pathname: `/standard-config/line-stress-sag-manage?libId=${record.id}&&libName=${record.libName}`,
                  })
                }}
              >
                <u>管理</u>
              </span>
            )
          },
        },
      ]
    }
    return [
      {
        dataIndex: 'libName',
        index: 'libName',
        title: '名称',
        width: 280,
      },
      {
        dataIndex: 'version',
        index: 'version',
        title: '版本',
        width: 140,
      },
      {
        dataIndex: 'remark',
        index: 'remark',
        title: '备注',
      },
      {
        dataIndex: '',
        title: '操作',
        width: 100,
        render: (text: any, record: any) => {
          return (
            <span
              className="canClick"
              onClick={() => message.error('已打开"应力弧垂表管理"界面，请关闭后重试')}
            >
              <u>管理</u>
            </span>
          )
        },
      },
    ]
  }, [lineStressSagFlag])

  //重启资源服务
  const restartLib = async () => {
    await restartResourceLib()
    message.success('操作成功')
  }

  const importLineStreeSagEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }

    setLibId(tableSelectRows[0].id)
    setUploadLineStressSagVisible(true)
  }

  const importMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('lib-import-linestresssag') && (
        <Menu.Item onClick={() => importLineStreeSagEvent()}>导入应力弧垂表</Menu.Item>
      )}
    </Menu>
  )

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('lib-import') && (
          <Dropdown overlay={importMenu}>
            <Button className="mr7">
              <ImportOutlined />
              导入
            </Button>
          </Dropdown>
        )}

        {buttonJurisdictionArray?.includes('lib-restart') && (
          <Button className="mr7" onClick={() => restartLib()}>
            <RedoOutlined />
            重启资源服务
          </Button>
        )}
      </div>
    )
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/ResourceLib/GetPageList"
        tableTitle="应力弧垂表管理"
        getSelectData={(data) => setTableSelectRows(data)}
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
          status: status,
        }}
      />

      <SaveImportLineStressSag
        libId={libId}
        requestSource="resource"
        visible={uploadLineStressSagVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setUploadLineStressSagVisible}
      />
    </PageCommonWrap>
  )
}

export default LineStressSag
