import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { Input, Button } from 'antd'
import React, { useState, useEffect } from 'react'

const { Search } = Input

interface Props {
  associated: () => void
  catalogueId: string
  scrolly: number
}

// const reducer = (state: State, action: any) => {
//   switch (action.code) {
//     case 'add':
//       return { routeList: [...state.routeList, { id: action.id, name: action.name }] };
//     case 'edit':
//       const routeList = [...state.routeList];
//       const currentDataIndex = routeList.findIndex((item) => item.id === action.id);
//       if (currentDataIndex !== routeList.length) {
//         routeList.splice(currentDataIndex + 1, routeList.length);
//       }
//       return { routeList: routeList };
//     default:
//       throw new Error('传入值不对');
//   }
// };

const columns = [
  {
    dataIndex: 'id',
    index: 'id',
    title: '编号',
    width: 180,
    ellipsis: true,
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '名称',
    width: 460,
    ellipsis: true,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '类型',
    width: 180,
    ellipsis: true,
  },
  {
    dataIndex: 'releaseDate',
    index: 'releaseDate',
    title: '发行日期',
    width: 80,
    ellipsis: true,
  },
  {
    dataIndex: 'remark',
    index: 'remark',
    title: '描述',
    ellipsis: true,
  },
]

const ListTable: React.FC<Props> = ({ catalogueId, scrolly, associated }) => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  const searchComponent = () => {
    return (
      <div style={{ display: 'flex' }}>
        <TableSearch label="搜索" width="203px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => tableSearchEvent()}
            enterButton
            placeholder="请输入关键词"
          />
        </TableSearch>
        &emsp;
        <Button type={'primary'} onClick={associated}>
          关联
        </Button>
      </div>
    )
  }

  const tableSearchEvent = () => {
    search()
  }

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }
  useEffect(() => {
    search()
  }, [catalogueId])
  return (
    <>
      <GeneralTable
        ref={tableRef}
        hasFooter={false}
        buttonLeftContentSlot={searchComponent}
        needCommonButton={false}
        columns={columns}
        noPaging={true}
        requestSource="tecEco"
        url="/QuotaManager/GetList"
        type="radio"
        scroll={{ y: scrolly }}
        extractParams={{
          keyWord: searchKeyWord,
          catalogueId,
        }}
      />
    </>
  )
}

export default ListTable
