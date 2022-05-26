import { fetchGridManageMenu } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useState } from 'react'

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
          key: index,
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

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1'])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0'])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue)
  }
  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue)
  }
  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      showIcon={true}
      blockNode={true}
      // titleRender={(item) => {
      //   return <div style={{color: 'red', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
      //     sdfg树大招风水电费水电费是的发送到发送到发送到发斯蒂芬</div>
      // }}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  )
}
export default PowerSupplyTree
