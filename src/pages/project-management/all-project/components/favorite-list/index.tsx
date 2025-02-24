import arrowImg from '@/assets/image/project-management/arrow.png'
import EmptyTip from '@/components/empty-tip'
import ImageIcon from '@/components/image-icon'
import { getFavorites } from '@/services/project-management/favorite-list'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { MenuFoldOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Button, Tree } from 'antd'
import uuid from 'node-uuid'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import TitleTreeNode from './components/title-tree-node'
import styles from './index.less'
import findCurrentNode, { getParentIds, mixinDeps } from './utils'
interface FavoriteListParams {
  visible?: boolean
  setVisible?: Dispatch<SetStateAction<boolean>>
  getFavId?: Dispatch<SetStateAction<string>>
  getFavName?: Dispatch<SetStateAction<string>>
  getFavType?: Dispatch<SetStateAction<number>>
  favName?: string
  setStatisticalTitle?: Dispatch<SetStateAction<string>>
  finishEvent?: () => void
}

interface treeDataItems {
  id: string
  text: string
  children: treeDataItems[]
}

const { DirectoryTree } = Tree

const FavoriteList: React.FC<FavoriteListParams> = (props) => {
  const {
    setVisible,
    getFavId,
    finishEvent,
    getFavName,
    setStatisticalTitle,
    favName,
    getFavType,
  } = props

  const [treeData, setTreeData] = useState<treeDataItems[]>([])
  const [parentId, setParentId] = useState<string>('')
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [allExpand, setAllExpand] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<string>('')
  const [selectkey, setSelectkey] = useState<string>('')
  const { data, run } = useRequest(() => getFavorites(), {
    onSuccess: () => {
      setTreeData(mixinDeps(data, 0))
    },
  })
  const [arr] = useState<string[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(getParentIds(data, arr))

  const createChildNode = (id: string) => {
    setExpandedKeys([...expandedKeys, id])
    const cloneData = JSON.parse(JSON.stringify(treeData))
    let currentNode = findCurrentNode(cloneData, id)
    const newChildNode = {
      id: uuid.v1(),
      text: '目录1',
      children: [],
    }
    setParentId(id)
    setIsEdit(newChildNode.id)
    setSelectkey(newChildNode.id)
    currentNode?.children.push(newChildNode)
    setTreeData(cloneData)
  }

  const mapTreeData = (data: any) => {
    return {
      title: (
        <TitleTreeNode
          id={data.id}
          text={data.text}
          onSelect={data.id === selectkey}
          isEdit={data.id === isEdit}
          parentId={parentId}
          setParentId={setParentId}
          setIsEdit={setIsEdit}
          refresh={run}
          favName={favName}
          deep={data.deps}
          category={data.category}
          createChildNode={createChildNode}
          setFavName={getFavName}
        />
      ),
      key: data.id,
      category: data.category,
      children: data.children?.map(mapTreeData),
      icon: (
        <ImageIcon
          width={18}
          height={14}
          imgUrl={`${
            data.category === 1
              ? 'all.png'
              : data.category === 2
              ? 'unclass.png'
              : data.category === 3
              ? 'recycle.png'
              : 'self.png'
          }`}
        />
      ),
    }
  }

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData)
  }, [JSON.stringify(treeData), selectkey, isEdit])

  const createEvent = () => {
    const newTreeNode = {
      id: uuid.v1(),
      text: '目录1',
      children: [],
    }
    setIsEdit(newTreeNode.id)
    setSelectkey(newTreeNode.id)
    setTreeData([...JSON.parse(JSON.stringify(treeData ? treeData : '')), newTreeNode])
  }

  const selectEvent = (e: any, g: any) => {
    if (e[0].length > 19 || e[0].indexOf('-') > -1) {
      return
    }
    if (e[0] !== selectkey) {
      setSelectkey(e[0])
      setIsEdit('')
    }
    getFavId?.(e[0])
    getFavType?.(g.node.category)
    getFavName?.(g.node.title.props.text)
  }

  const openCLoseEvent = () => {
    setAllExpand(!allExpand)
    if (allExpand) {
      setExpandedKeys([])
    } else {
      setExpandedKeys(getParentIds(data, arr))
    }
  }

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
  }

  useUpdateEffect(() => {
    if (!favName) {
      setSelectkey('')
    }
  }, [favName])

  return (
    <div className={styles.engineerList}>
      <div className={styles.favHeader}>
        <div className={styles.favTitle}>项目目录</div>
        <div className={styles.headBtn}>
          {buttonJurisdictionArray?.includes('new-favorite') && (
            <Button className="mr7" onClick={createEvent}>
              <PlusOutlined style={{ color: '#aeaeae' }} />
              新建
            </Button>
          )}
          {buttonJurisdictionArray?.includes('quit-favorite') && (
            <Button
              onClick={() => {
                setVisible?.(false)
                setIsEdit('')
                setSelectkey('')
                // setAllExpand(true);
                getFavId?.('')
                getFavName?.('')
                setStatisticalTitle?.('-1')
                finishEvent?.()
              }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ImageIcon width={18} height={18} imgUrl="exit.png" marginRight={8} />
              退出
            </Button>
          )}
        </div>
      </div>

      {!treeData ? (
        <div className={styles.favEmpty}>
          <div className={styles.createTips}>
            <span>点击此处新建文件夹</span>
            <img src={arrowImg} style={{ verticalAlign: 'baseline' }} alt="" />
          </div>
          <EmptyTip description="暂无内容" />
        </div>
      ) : (
        treeData.length > 0 && (
          <div className={styles.favTree}>
            <DirectoryTree
              key={JSON.stringify(allExpand)}
              treeData={handleData}
              height={650}
              // defaultExpandAll={allExpand}
              onSelect={selectEvent}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              selectedKeys={[selectkey]}
              virtual={false}
              expandAction="doubleClick"
            />
          </div>
        )
      )}
      <div className={styles.favFooter}>
        <span style={{ cursor: 'pointer' }} onClick={() => openCLoseEvent()}>
          <MenuFoldOutlined />
          &nbsp; {allExpand ? '全部收起' : '全部展开'}
        </span>
      </div>
    </div>
  )
}

export default FavoriteList
