import {
  featchSubstationTreeData,
  getTransformerSubstationMenu,
} from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { KVLEVELOPTIONS } from '../DrawToolbar/GridUtils'
import { loadMapLayers } from '../GridMap/utils/initializeMap'

const SubstationTree = () => {
  const { data } = useRequest(() => getTransformerSubstationMenu())
  const { mapRef } = useMyContext()
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  const treeData = [
    {
      title: '变电站',
      key: '0-1',
      children: data?.map((item, index) => {
        return {
          ...item,
          title: item.name,
          key: `0-1-${index}`,
          children: item.lineKVLevelGroups.map(
            (
              child: { kvLevel: number; lines: { name: string; id: string }[] },
              childIndex: number
            ) => {
              const childTitle = KVLEVELOPTIONS.find((kv) => kv.kvLevel === child.kvLevel)
              return {
                ...child,
                title: childTitle ? childTitle.label : '未知电压',
                key: `0-1-${index}-${childIndex}`,
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
        loadMapLayers(TreeData, mapRef)
      },
    }
  )

  useEffect(() => {
    checkedKeys.length && getTreeData()
  }, [checkedKeys, getTreeData])

  const getSubstationTreeData = (checkedKeys: any) => {
    const checkedIds = checkedKeys.filter((item: string) => !item.includes('-'))
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
        mapRef
      )
    }
  }

  return <Tree checkable defaultExpandAll onCheck={getSubstationTreeData} treeData={treeData} />
}
export default SubstationTree
