import { getTransformerSubstationMenu } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useState } from 'react'

const SubstationTree = () => {
  const { data } = useRequest(() => getTransformerSubstationMenu())

  const treeData = [
    {
      title: '电源',
      key: '0-0',
      children: [
        {
          title: '火电',
          key: '0-0-0',
          children: [
            { title: '火电房屋变电站', key: '0-0-0-0' },
            { title: '火电道路变电站', key: '0-0-0-1' },
            { title: '火电河流变电站', key: '0-0-0-2' },
          ],
        },
        {
          title: '水电',
          key: '0-0-1',
          children: [
            { title: '水电民用的发送到发送到发送到发斯蒂芬变电站', key: '0-0-1-0' },
            { title: '水电商用变电站', key: '0-0-1-1' },
            { title: '水电军事变电站', key: '0-0-1-2' },
          ],
        },
        {
          title: '风电',
          key: '0-0-2',
        },
      ],
    },
  ]
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1'])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
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
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={data}
    />
  )
}
export default SubstationTree
