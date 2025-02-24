import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { Input } from 'antd'
import React, { useRef, useState } from 'react'
import EnumSelect from '@/components/enum-select'
import styles from './index.less'
import { CreateMethod } from '@/services/material-config/inventory'

interface CheckMappingParams {
  inventoryOverviewId: string
  invName: string
  mappingId: string
}

const { Search } = Input

const CheckMapping: React.FC<CheckMappingParams> = (props) => {
  const { inventoryOverviewId, invName, mappingId } = props

  const tableRef = useRef<HTMLDivElement>(null)
  const [createMethod, setCreateMethod] = useState<string>('')

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  const columns = [
    {
      title: '资源库物料编码',
      dataIndex: 'materialCode',
      index: 'materialCode',
      width: 160,
    },
    {
      title: '名称',
      dataIndex: 'resourceMaterial',
      index: 'resourceMaterial',
      width: 220,
    },
    {
      title: '规格型号',
      dataIndex: 'resourceMaterialSpec',
      index: 'resourceMaterialSpec',
      width: 220,
    },
    {
      title: '类别',
      dataIndex: 'category',
      index: 'category',
      width: 220,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      index: 'unit',
      width: 150,
    },
    {
      title: '协议库存映射物料',
      dataIndex: 'area',
      index: 'area',
      width: 180,
    },
    {
      title: '协议库存所在地区',
      dataIndex: 'area',
      index: 'area',
      width: 180,
    },
    {
      title: '需求公司',
      dataIndex: 'demandCompany',
      index: 'demandCompany',
      width: 380,
    },
    {
      title: '订单净价',
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      width: 180,
    },
    {
      title: '计量单位',
      dataIndex: 'measurementUnit',
      index: 'measurementUnit',
      width: 180,
    },
    {
      title: '创建方式',
      dataIndex: 'howToCreate',
      index: 'howToCreate',
      width: 150,
      render: (text: any, record: any) => {
        return record.howToCreateText
      },
    },
  ]

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }

  // const refresh = () => {
  //   if (tableRef && tableRef.current) {
  //     //@ts-ignore
  //     tableRef.current.refresh();
  //   }
  // };

  const searchByMethod = (value: any) => {
    setCreateMethod(value)
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({
        inventoryOverviewId: inventoryOverviewId,
        howToCreate: value,
        mappingId: mappingId,
      })
    }
  }

  // useEffect(() => {
  //   searchByMethod(createMethod);
  // }, [createMethod]);

  const tableLeftSlot = (
    <div className={styles.searchArea}>
      <TableSearch width="230px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => search()}
          enterButton
          placeholder="关键词"
        />
      </TableSearch>
      <TableSearch className={styles.createMethod} marginLeft="20px" label="创建方式" width="220px">
        <EnumSelect
          allowClear
          allLabel="-选择创建方式-"
          enumList={CreateMethod}
          placeholder="请选择创建方式"
          onChange={(value: any) => searchByMethod(value)}
        ></EnumSelect>
      </TableSearch>
      <TableSearch
        className={styles.inventorySelect}
        marginLeft="20px"
        label="当前协议库存"
        width="300px"
      >
        <Input disabled value={invName} />
      </TableSearch>
    </div>
  )

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        ref={tableRef}
        url="/Inventory/GetMaterialInventoryMappingList"
        columns={columns}
        type="radio"
        requestSource="resource"
        tableTitle="协议库存物料映射全表查看"
        extractParams={{
          inventoryOverviewId: inventoryOverviewId,
          keyWord: searchKeyWord,
          howToCreate: createMethod,
          mappingId: mappingId,
        }}
      />
    </div>
  )
}

export default CheckMapping
