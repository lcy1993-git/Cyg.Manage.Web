import CommonTitle from '@/components/common-title'
import EmptyTip from '@/components/empty-tip'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import {
  getCompanyStructureTreeList,
  deleteCompany,
} from '@/services/backstage-config/company-structure'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { flatten } from '@/utils/utils'
import {
  DownOutlined,
  EditOutlined,
  MinusSquareOutlined,
  PlusOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons'
import { useMount, useRequest } from 'ahooks'
import { Button, Input, message, Radio, Spin, Tree } from 'antd'
import React, { Key, useMemo, useState } from 'react'
import AddModel from './components/add-model'
import EditModel from './components/edit-model/idnex'
import styles from './index.less'
import ModalConfirm from '@/components/modal-confirm'

const { Search } = Input

const CompanyStructure: React.FC = () => {
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [checkRadioValue, setCheckRadioValue] = useState<string>('')
  const [expendKeys, setExpendKeys] = useState<Key[]>([])
  const [addModelVisible, setAddModelVisible] = useState(false)
  const [editModelVisible, setEditModelVisible] = useState(false)
  const [sourceName, setSourceName] = useState<string>('')

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const { data, loading, run } = useRequest(getCompanyStructureTreeList, {
    onSuccess: () => {
      setExpendKeys(data ? flatten(data).map((item: any) => item.id) : [])
    },
    manual: true,
  })

  const handleDataFunction = (data: any): any => {
    return {
      key: data.id,
      title: getTreeNodeTitle(data.id, data.text),
      children:
        data.children && data.children.length > 0 ? data.children.map(handleDataFunction) : [],
    }
  }

  const getTreeNodeTitle = (id: string, text: string) => {
    return <Radio value={id}>{text}</Radio>
  }

  const handleData = useMemo(() => {
    return data ? data.map(handleDataFunction) : []
  }, [data])

  const openAll = () => {
    setExpendKeys(data ? flatten(data).map((item: any) => item.id) : [])
  }

  const foldAll = () => {
    setExpendKeys([])
  }

  const tableSearchEvent = () => {
    run({ keyWord: searchKeyWord })
    setCheckRadioValue('')
  }

  const searchComponent = (
    <TableSearch width="203px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => tableSearchEvent()}
        enterButton
        placeholder="请输入搜索关键词"
      />
    </TableSearch>
  )

  const addEvent = () => {
    setAddModelVisible(true)
  }

  const editEvent = () => {
    if (!checkRadioValue) {
      message.info('请选择一个公司')
      return
    }
    const companyName = flatten<{ text: string }>(data).find(
      (item: any) => item.id === checkRadioValue
    )?.text
    setSourceName(companyName ?? '')
    setEditModelVisible(true)
  }

  const deleteEvent = async () => {
    await deleteCompany({ companyId: checkRadioValue })
    message.success('删除成功')
    tableSearchEvent()
  }

  const deleteContent = () => {
    return (
      <>
        <span>
          此操作将会删除该公司及其全部子级公司，
          <br />
          确认删除选中项吗？
        </span>
      </>
    )
  }

  const tableButton = (
    <div>
      {buttonJurisdictionArray?.includes('add-structure-company') && (
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
      )}
      {buttonJurisdictionArray?.includes('edit-structure-company') && (
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      )}
      {buttonJurisdictionArray?.includes('delete-structure-company') && (
        <ModalConfirm
          changeEvent={deleteEvent}
          selectData={[checkRadioValue].filter(Boolean)}
          contentSlot={deleteContent}
        />
      )}
    </div>
  )

  const treeNodeSelectEvent = (selectedKeys: Key[]) => {
    setCheckRadioValue(String(selectedKeys[0]))
  }

  const treeNodeExpandEvent = (expandedKey: Key[]) => {
    setExpendKeys(expandedKey)
  }

  useMount(() => {
    run({ keyWord: '' })
  })

  return (
    <PageCommonWrap>
      <CommonTitle>供电公司架构</CommonTitle>
      <div className={styles.companyStructureSearch}>
        <div className={styles.companyStructureLeft}>{searchComponent}</div>
        <div className={styles.companyStructureRight}>{tableButton}</div>
      </div>
      <div className={styles.companyStructureContainer}>
        <Spin spinning={loading}>
          {handleData?.length === 0 && (
            <div className={styles.tableEmpty}>
              <EmptyTip />
            </div>
          )}
          {handleData?.length > 0 && (
            <>
              <div className={styles.companyStructureTableHeader}>
                <span className={`${styles.singleButton} mr10`} onClick={() => openAll()}>
                  <PlusSquareOutlined className={'mr7'} />
                  展开
                </span>
                <span className={styles.singleButton} onClick={() => foldAll()}>
                  <MinusSquareOutlined className={'mr7'} />
                  收起
                </span>
              </div>
              <div className={styles.companyStructureTable}>
                <Radio.Group
                  name="company"
                  value={checkRadioValue}
                  onChange={(e) => setCheckRadioValue(e.target.value)}
                >
                  <Tree
                    switcherIcon={<DownOutlined />}
                    onExpand={treeNodeExpandEvent}
                    expandedKeys={expendKeys}
                    onSelect={treeNodeSelectEvent}
                    treeData={handleData}
                  />
                </Radio.Group>
              </div>
            </>
          )}
        </Spin>
        {addModelVisible && (
          <AddModel
            visible={addModelVisible}
            onChange={setAddModelVisible}
            finishEvent={tableSearchEvent}
          />
        )}
        {editModelVisible && (
          <EditModel
            sourceName={sourceName}
            sourceCompanyId={checkRadioValue}
            visible={editModelVisible}
            onChange={setEditModelVisible}
            finishEvent={tableSearchEvent}
          />
        )}
      </div>
    </PageCommonWrap>
  )
}

export default CompanyStructure
