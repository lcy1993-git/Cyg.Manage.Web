import { featchPowerSupplyTreeData, fetchGridManageMenu } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { loadMapLayers } from '../GridMap/utils/initializeMap'

interface PowerSupplyListType {
  companyId: string // 公司编号
  createdBy: string // 创建人
  geom: string // 经纬度坐标
  id: string
  installedCapacity: number // 装机容器
  kvLevel: number // 电压等级
  name: string // 厂站名称
  powerType: string // 电源类型
  schedulingMode: string // 调度方式
}

const PowerSupplyTree = () => {
  const { data } = useRequest(() => fetchGridManageMenu())
  const { mapRef } = useMyContext()
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const treeData = [
    {
      title: '电源',
      key: '0-0',
      children: data?.map((item, index) => {
        return {
          title: item.type,
          key: `0-0-${index}`,
          children: item.powerSupplyList.map((child: PowerSupplyListType) => {
            return {
              ...child,
              title: child.name,
              key: child.id,
            }
          }),
        }
      }),
    },
  ]

  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchPowerSupplyTreeData({ ids: checkedKeys }),
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

  const getPowerSupplyTreeData = (checkedKeys: any) => {
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

  return <Tree checkable defaultExpandAll onCheck={getPowerSupplyTreeData} treeData={treeData} />
}
export default PowerSupplyTree
