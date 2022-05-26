import { fetchGridManageMenu } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'

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

  return <Tree checkable showIcon={true} blockNode={true} treeData={treeData} />
}
export default PowerSupplyTree
