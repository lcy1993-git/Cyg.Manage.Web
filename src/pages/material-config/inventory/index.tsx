import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { Input, Button, Modal, message } from 'antd'
import React, { useRef, useState } from 'react'
import styles from './index.less'

// import UrlSelect from '@/components/url-select';
import { ImportOutlined } from '@ant-design/icons'
import ImportInventory from './components/import-form'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import InventoryTable from './components/inventory-table'
import HasMapModal from './components/has-map-modal'
import moment from 'moment'

const { Search } = Input

// interface SelectParams {
//   value: string | number;
//   label: string;
// }

const Inventroy: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [inventoryId, setInventoryId] = useState<string>('')
  const [inventoryName, setInventoryName] = useState<string>('')
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false)

  const [inventoryTableModalVisible, setInventoryTableModalVisible] = useState<boolean>(false)
  const [hasMapModalVisible, setHasMapModalVisible] = useState<boolean>(false)

  const [versionNo, setVersionNo] = useState<string>('')
  const [invName, setInvName] = useState<string>('')
  const hasMapRef = useRef()

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  // const { data: inventoryData = [], loading } = useRequest(() => getInventoryOverviewList());

  // const handleInvData = useMemo(() => {
  //   return inventoryData.map((item) => {
  //     return {
  //       value: item.id,
  //       title:
  //         item.name === item.version
  // ? `${item.provinceName}_${item.resourceLibName}_${item.year}_${item.name}`
  //           : `${item.name}_${item.version}`,
  //     };
  //   });
  // }, [JSON.stringify(inventoryData)]);

  const resetHasMap = () => {
    if (hasMapRef && hasMapRef.current) {
      // @ts-ignore
      hasMapRef.current.resetEvent()
    }
  }

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="278px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入协议库存信息"
          />
        </TableSearch>
      </div>
    )
  }

  //选择协议库存传InvId
  // const searchByInv = (value: any) => {
  //   const currentVal = handleInvData.filter((item: any) => {
  //     if (value === item.value) {
  //       return item.title;
  //     }
  //   });

  //   setNowSelectedInv(currentVal[0]?.title);

  //   setInventoryId(value);
  //   if (tableRef && tableRef.current) {
  //     // @ts-ignore
  //     tableRef.current.searchByParams({
  //       inventoryOverviewId: value,
  //       demandCompany: searchKeyWord,
  //       keyWord: searchKeyWord,
  //     });
  //   }
  // };

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

  //查看协议库存
  const checkEvent = (id: string, version: string, name: string) => {
    setVersionNo(version)
    setInvName(name)
    setInventoryId(id)
    setInventoryTableModalVisible(true)
  }

  const columns = [
    {
      dataIndex: 'name',
      index: 'name',
      title: '名称',
      width: 280,
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('inventory-check') && (
              <span
                onClick={() => checkEvent(record.id, record.version, record.name)}
                className={styles.checkInventory}
              >
                {record.name}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('inventory-check') && <span>{record.name}</span>}
          </>
        )
      },
    },
    {
      dataIndex: 'province',
      index: 'province',
      title: '区域',
      width: 180,
      render: (text: any, record: any) => {
        return record.provinceName
      },
    },
    {
      dataIndex: 'creator',
      index: 'creator',
      title: '创建人',
      width: 320,
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
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 180,
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
  ]

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('inventory-create') && (
          <Button className="mr7" type="primary" onClick={() => importInventoryEvent()}>
            <ImportOutlined />
            新建
          </Button>
        )}
        {/* {buttonJurisdictionArray?.includes('inventory-check') && (
          <Button
            disabled={tableSelectRows && tableSelectRows.length > 0 ? false : true}
            className={styles.importBtn}
            onClick={() => checkInventoryEvent()}
          >
            查看
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('inventory-mapping-manage') && (
          <Button className={styles.importBtn} onClick={() => openMapManageEvent()}>
            映射管理
          </Button>
        )}
      </div>
    )
  }

  //映射管理
  const openMapManageEvent = () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择一个对象进行操作')
      return
    }
    setInventoryName(tableSelectRows[0].name)
    setInventoryId(tableSelectRows[0].id)
    setHasMapModalVisible(true)
  }

  //导入
  const importInventoryEvent = () => {
    setImportFormVisible(true)
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  //查看协议库存
  // const checkInventoryEvent = () => {
  //   if (tableSelectRows && tableSelectRows.length === 0) {
  //     message.info('请先选择协议库存')
  //     return
  //   }
  //   setVersionNo(tableSelectRows[0].version)
  //   setInvName(tableSelectRows[0].name)
  //   setInventoryId(tableSelectRows[0].id)
  //   setInventoryTableModalVisible(true)
  // }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/Inventory/GetInventoryOverviewPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        tableTitle="协议库存管理"
        type="radio"
        extractParams={{
          inventoryOverviewId: inventoryId,
          keyWord: searchKeyWord,
        }}
      />

      <Modal
        maskClosable={false}
        width="98%"
        bodyStyle={{ height: '790px', overflowY: 'auto' }}
        visible={inventoryTableModalVisible}
        footer=""
        centered
        onCancel={() => setInventoryTableModalVisible(false)}
      >
        <InventoryTable inventoryId={inventoryId} versionNo={versionNo} invName={invName} />
      </Modal>

      <Modal
        maskClosable={false}
        width="80%"
        title="映射管理"
        bodyStyle={{ height: 'auto', overflowY: 'auto' }}
        visible={hasMapModalVisible}
        footer=""
        onCancel={() => {
          resetHasMap?.()
          setHasMapModalVisible(false)
        }}
      >
        <HasMapModal inventoryId={inventoryId} name={inventoryName} ref={hasMapRef} />
      </Modal>
      {/* 
      {addMapVisible && (
        <CreateMap
          visible={addMapVisible}
          inventoryOverviewId={inventoryId}
          onChange={setAddMapVisible}
        />
      )} */}
      {importFormVisible && (
        <ImportInventory
          requestSource="resource"
          visible={importFormVisible}
          changeFinishEvent={() => uploadFinishEvent()}
          onChange={setImportFormVisible}
        />
      )}
    </PageCommonWrap>
  )
}

export default Inventroy
