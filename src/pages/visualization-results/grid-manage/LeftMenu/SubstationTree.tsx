import {
  deleteLine,
  featchSubstationTreeData,
  getTransformerSubstationMenu,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Modal, Tree } from 'antd'
import { message } from 'antd/es'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { KVLEVELOPTIONS } from '../DrawToolbar/GridUtils'
import { loadMapLayers } from '../GridMap/utils/initializeMap'

interface TreeSelectType {
  event: 'select'
  selected: boolean
  node: EventDataNode
  selectedNodes: {
    title: string
    key: string
    name?: string
    id?: string
    children: any[] | undefined
  }[]
  nativeEvent: MouseEvent
}

const SubstationTree = () => {
  const { data, run: getTree } = useRequest(() => getTransformerSubstationMenu(), { manual: true })
  const { mapRef, isRefresh, setisRefresh } = useMyContext()
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const treeData = [
    {
      title: '变电站',
      key: '0=1',
      children: data?.map((item, index) => {
        return {
          ...item,
          title: item.name,
          key: `0=1=${index}`,
          children: item.lineKVLevelGroups.map(
            (
              child: { kvLevel: number; lines: { name: string; id: string }[] },
              childIndex: number
            ) => {
              const childTitle = KVLEVELOPTIONS.find((kv) => kv.kvLevel === child.kvLevel)
              return {
                ...child,
                title: childTitle ? childTitle.label : '未知电压',
                key: `0=1=${index}=${childIndex}`,
                children: child.lines.map((children: { name: string; id: string }) => {
                  return {
                    ...children,
                    title: children.name,
                    key: children.id,
                  }
                }),
              }
            }
          ),
        }
      }),
    },
  ]

  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchSubstationTreeData(checkedKeys),
    {
      manual: true,
      onSuccess: () => {
        loadMapLayers(TreeData, mapRef.map)
      },
    }
  )

  const onSelect = (selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info
    if (selectedNodes.length && !selectedNodes[0].children) {
      setisRefresh(false)
      Modal.confirm({
        title: '确认删除该条线路吗？',
        icon: <ExclamationCircleOutlined />,
        content: `${selectedNodes[0].name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteLine([selectedNodes[0].id])
            setisRefresh(true)
            message.info('删除成功')
            const currentSelectLineIds = checkedKeys.filter((item) => item !== selectedNodes[0].id)
            setCheckedKeys(currentSelectLineIds)
          } catch (err) {
            message.error('删除失败')
          }
        },
      })
    }
  }

  useEffect(() => {
    isRefresh && getTree()
  }, [getTree, isRefresh])

  useEffect(() => {
    checkedKeys.length && getTreeData()
  }, [checkedKeys, getTreeData])

  const getSubstationTreeData = (checkedKeys: any) => {
    const checkedIds = checkedKeys.filter((item: string) => !item.includes('='))
    setCheckedKeys(checkedIds)
    if (!checkedIds.length) {
      loadMapLayers(
        {
          boxTransformerList: [], // 箱变列表
          cableBranchBoxList: [], // 电缆分支箱
          cableWellList: [], // 电缆井
          columnCircuitBreakerList: [], // 柱上断路器
          columnTransformerList: [], // 柱上变压器
          electricityDistributionRoomList: [], // 配电室
          lineRelationList: [], // 线路连接关系表
          ringNetworkCabinetList: [], // 环网柜
          switchingStationList: [], // 开闭所
          towerList: [], // 杆塔
          lineList: [], // 线路表
        },
        mapRef.map
      )
    }
  }

  return (
    <Tree
      checkable
      defaultExpandAll
      onCheck={getSubstationTreeData}
      onSelect={onSelect}
      treeData={treeData}
    />
  )
}
export default SubstationTree
