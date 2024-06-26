/**
 * 站房管理 06-17
 * author：huangz
 */
import EnumSelect from '@/components/enum-select'
import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { StationHouseEnum } from '@/services/station-house'
import { ImportOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React, { useMemo, useState } from 'react'
import ImportScheme from './components/import-scheme'
import ModuleDraw from './components/module-draw'
import StationDetail from './components/station-detail'
import styles from './index.less'

const { Search } = Input

const StationHouse: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  //站房模版图纸模态框
  const [stationDrawVisible, setStationDrawVisible] = useState<boolean>(false)

  // 站房详情模态框
  const [stationDetailVisible, setStationDetailVisble] = useState<boolean>(false)

  // 导入方案模态框
  const [importVisible, setImportVisible] = useState<boolean>(false)

  const [status, setStatus] = useState<string>('')

  // 当前站房方案code
  const [stationCode, setStationCode] = useState<string>('')
  // 当前站房方案名称
  const [schemeName, setSchemeName] = useState<string>('') //当前站房id

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
        <TableSearch marginLeft="20px" label="站房类型" width="300px">
          <EnumSelect
            enumList={StationHouseEnum}
            onChange={(value) => searchByStatus(value)}
            placeholder="-全部-"
            allowClear
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
        keyWord: searchKeyWord,
        category: value,
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
      tableRef.current.searchByParams({
        keyWord: searchKeyWord,
        category: status,
      })
    }
  }

  const columns = useMemo(() => {
    return [
      {
        dataIndex: 'code',
        index: 'code',
        title: '方案编码',
        width: 280,
      },
      {
        dataIndex: 'name',
        index: 'name',
        title: '方案名称',
        width: 280,
      },
      {
        dataIndex: 'categoryText',
        index: 'categoryText',
        title: '站房类型',
        width: 240,
      },
      {
        dataIndex: 'parentName',
        index: 'parentName',
        title: '父级方案名称',
        width: 180,
      },
      {
        dataIndex: 'kvLevelText',
        index: 'kvLevelText',
        title: '电压等级',
        width: 140,
      },
      {
        dataIndex: 'desc',
        index: 'desc',
        title: '备注',
        //   width: 200,
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
                setStationDetailVisble(true)
                setStationCode(record.code)
                setSchemeName(record.name)
              }}
            >
              <u>详情</u>
            </span>
          )
        },
      },
    ]
  }, [])

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button className="mr7" type="primary" onClick={() => setStationDrawVisible(true)}>
          站房模版图纸
        </Button>
        <Button className="mr7" onClick={() => setImportVisible(true)}>
          <ImportOutlined />
          导入站房方案
        </Button>
      </div>
    )
  }

  // 导入后刷新列表
  const importFinishEvent = () => {
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
        url="/StationScheme/QueryStationSchemePage"
        tableTitle="站房方案管理"
        type="radio"
      />

      {/* 站房详情 */}
      <StationDetail
        visible={stationDetailVisible}
        onChange={setStationDetailVisble}
        code={stationCode}
        schemeName={schemeName}
      />

      {/* 站房模版图纸 */}
      <ModuleDraw
        visible={stationDrawVisible}
        changeFinishEvent={() => importFinishEvent()}
        onChange={setStationDrawVisible}
      />

      {/* 导入站房方案 */}
      <ImportScheme
        visible={importVisible}
        changeFinishEvent={() => importFinishEvent()}
        onChange={setImportVisible}
        url="/StationScheme/ImportStationScheme"
        title="站房方案导入"
        accept=".xlsx,.xls"
      />
    </PageCommonWrap>
  )
}

export default StationHouse
